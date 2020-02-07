import { SearchIndexManager, $rootScope, copy, tsNow, safeReplaceObject, dT, _, listMergeSorted, deepEqual } from "../utils";
import appMessagesIDsManager from "./appMessagesIDsManager";
import appChatsManager from "./appChatsManager";
import appUsersManager from "./appUsersManager";
import { RichTextProcessor } from "../richtextprocessor";
import { nextRandomInt, bigint } from "../bin_utils";
import { MTProto, telegramMeWebService } from "../mtproto/mtproto";
import apiUpdatesManager from "./apiUpdatesManager";
import appPhotosManager from "./appPhotosManager";
import appProfileManager from "./appProfileManager";

import AppStorage from '../storage';
import AppPeersManager from "./appPeersManager";
import ServerTimeManager from "../mtproto/serverTimeManager";
import apiFileManager, { CancellablePromise } from "../mtproto/apiFileManager";
import { MTDocument } from "../../components/misc";
import appDocsManager from "./appDocsManager";

type HistoryStorage = {
  count: number | null,
  history: number[],
  pending: number[],
  readPromise?: any
};

export class AppMessagesManager {
  public messagesStorage: any = {};
  public messagesForHistory: any = {};
  public messagesForDialogs: any = {};
  public historiesStorage: {
    [peerID: string]: HistoryStorage
  } = {};
  public dialogsStorage: {
    count: any,
    dialogs: any[]
  } = {count: null, dialogs: []};
  public pendingByRandomID: any = {};
  public pendingByMessageID: any = {};
  public pendingAfterMsgs: any = {};
  public pendingTopMsgs: any = {};
  public sendFilePromise: CancellablePromise<void> = Promise.resolve();
  public tempID = -1;

  public dialogsIndex: any = SearchIndexManager.createIndex();
  public cachedResults: any = {query: false};

  public lastSearchFilter: any = {};
  public lastSearchResults: any = [];

  public needSingleMessages: any = [];
  public fetchSingleMessagesTimeout = 0;
  private fetchSingleMessagesPromise: Promise<void> = null;

  public incrementedMessageViews: any = {};
  public needIncrementMessageViews: any = [];
  public incrementMessageViewsTimeout: any = false;

  public maxSeenID = 0;

  public allDialogsLoaded = false;
  public dialogsOffsetDate = 0;
  public pinnedIndex = 0;
  public dialogsNum = 0;

  public migratedFromTo: any = {};
  public migratedToFrom: any = {};

  public newMessagesHandlePromise = 0;
  public newMessagesToHandle: any = {};
  public newDialogsHandlePromise = 0;
  public newDialogsToHandle: any = {};
  public notificationsHandlePromise = 0;
  public notificationsToHandle: any = {};
  public newUpdatesAfterReloadToHandle: any = {};

  public fwdMessagesPluralize = _('conversation_forwarded_X_messages');
  public gameScorePluralize = _('conversation_scored_X');

  constructor() {
    AppStorage.get<number>('max_seen_msg').then((maxID) => {
      if(maxID && !appMessagesIDsManager.getMessageIDInfo(maxID)[1]) {
        this.maxSeenID = maxID;
      }
    })

    $rootScope.$on('apiUpdate', (e: CustomEvent) => {
      let update: any = e.detail;
      // if(update._ != 'updateUserStatus') {
      //   console.log('on apiUpdate', update)
      // }
      this.handleUpdate(update);
    });

    $rootScope.$on('webpage_updated', (e: CustomEvent) => {
      let eventData = e.detail;
      eventData.msgs((msgID: number) => {
        var historyMessage = this.messagesForHistory[msgID];
        if(historyMessage) {
          /* historyMessage.media = {
            _: 'messageMediaWebPage',
            webpage: AppWebPagesManager.wrapForHistory(eventData.id)
          }; */ // warning

          $rootScope.$broadcast('message_edit', {
            peerID: this.getMessagePeer(historyMessage),
            id: historyMessage.id,
            mid: msgID,
            justMedia: true
          });
        }
      });
    });

    $rootScope.$on('draft_updated', (e: CustomEvent) => {
      let eventData = e.detail;;
      var peerID = eventData.peerID;
      var draft = eventData.draft;

      var dialog = this.getDialogByPeerID(peerID)[0];
      if(dialog) {
        var topDate;
        if(draft && draft.date) {
          topDate = draft.date;
        } else {
          var channelID = AppPeersManager.isChannel(peerID) ? -peerID : 0
          var topDate = this.getMessage(dialog.top_message).date;

          if(channelID) {
            var channel = appChatsManager.getChat(channelID);
            if(!topDate || channel.date && channel.date > topDate) {
              topDate = channel.date;
            }
          }
        }

        if(!dialog.pFlags.pinned) {
          dialog.index = this.generateDialogIndex(topDate);
        }

        this.pushDialogToStorage(dialog);

        $rootScope.$broadcast('dialog_draft', {
          peerID: peerID,
          draft: draft,
          index: dialog.index
        });
      }
    })
  }

  public getInputEntities(entities: any) {
    var sendEntites = copy(entities);
    sendEntites.forEach((entity: any) => {
      if(entity._ == 'messageEntityMentionName') {
        entity._ = 'inputMessageEntityMentionName';
        entity.user_id = appUsersManager.getUserInput(entity.user_id);
      }
    });
    return sendEntites;
  }

  public sendText(peerID: number, text: string, options: any = {}) {
    if(typeof(text) != 'string') {
      return;
    }

    peerID = AppPeersManager.getPeerMigratedTo(peerID) || peerID;

    var entities = options.entities || [];
    if(!options.viaBotID) {
      text = RichTextProcessor.parseMarkdown(text, entities);
    }
    if(!text.length) {
      return;
    }

    var sendEntites = this.getInputEntities(entities);
    var messageID = this.tempID--;
    var randomID = [nextRandomInt(0xFFFFFFFF), nextRandomInt(0xFFFFFFFF)];
    var randomIDS = bigint(randomID[0]).shiftLeft(32).add(bigint(randomID[1])).toString();
    var historyStorage = this.historiesStorage[peerID];
    var flags = 0;
    var pFlags: any = {};
    var replyToMsgID = options.replyToMsgID;
    var isChannel = AppPeersManager.isChannel(peerID);
    var isMegagroup = isChannel && AppPeersManager.isMegagroup(peerID);
    var asChannel = isChannel && !isMegagroup ? true : false;
    var message: any;

    if(historyStorage === undefined) {
      historyStorage = this.historiesStorage[peerID] = {count: null, history: [], pending: []}
    }

    var fromID = appUsersManager.getSelf().id;
    if(peerID != fromID) {
      flags |= 2;
      pFlags.out = true;

      if(!isChannel && !appUsersManager.isBot(peerID)) {
        flags |= 1;
        pFlags.unread = true;
      }
    }

    if(replyToMsgID) {
      flags |= 8
    }

    if(asChannel) {
      fromID = 0
      pFlags.post = true
    } else {
      flags |= 256
    }

    message = {
      _: 'message',
      id: messageID,
      from_id: fromID,
      to_id: AppPeersManager.getOutputPeer(peerID),
      flags: flags,
      pFlags: pFlags,
      date: tsNow(true) + MTProto.serverTimeManager.serverTimeOffset,
      message: text,
      random_id: randomIDS,
      reply_to_msg_id: replyToMsgID,
      via_bot_id: options.viaBotID,
      reply_markup: options.reply_markup,
      entities: entities,
      views: asChannel && 1,
      pending: true
    };

    var toggleError = (on: any) => {
      var historyMessage = this.messagesForHistory[messageID];
      if(on) {
        message.error = true;
        if(historyMessage) {
          historyMessage.error = true;
        }
      } else {
        delete message.error;
        if(historyMessage) {
          delete historyMessage.error;
        }
      }
      $rootScope.$broadcast('messages_pending');
    }

    message.send = () =>  {
      toggleError(false);
      var sentRequestOptions: any = {};
      if(this.pendingAfterMsgs[peerID]) {
        sentRequestOptions.afterMessageID = this.pendingAfterMsgs[peerID].messageID;
      }

      var flags = 0;
      if(replyToMsgID) {
        flags |= 1;
      }

      if(asChannel) {
        flags |= 16;
      }

      if(options.clearDraft) {
        flags |= 128;
      }

      var apiPromise: any;
      if(options.viaBotID) {
        apiPromise = MTProto.apiManager.invokeApi('messages.sendInlineBotResult', {
          flags: flags,
          peer: AppPeersManager.getInputPeerByID(peerID),
          random_id: randomID,
          reply_to_msg_id: appMessagesIDsManager.getMessageLocalID(replyToMsgID),
          query_id: options.queryID,
          id: options.resultID
        }, sentRequestOptions);
      } else {
        if(sendEntites.length) {
          flags |= 8;
        }

        apiPromise = MTProto.apiManager.invokeApi('messages.sendMessage', {
          flags: flags,
          peer: AppPeersManager.getInputPeerByID(peerID),
          message: text,
          random_id: randomID,
          reply_to_msg_id: appMessagesIDsManager.getMessageLocalID(replyToMsgID),
          entities: sendEntites
        }, sentRequestOptions);
      }

      // console.log(flags, entities)
      apiPromise.then((updates: any) => {
        if(updates._ == 'updateShortSentMessage') {
          message.flags = updates.flags;
          message.date = updates.date;
          message.id = updates.id;
          message.media = updates.media;
          message.entities = updates.entities;
          updates = {
            _: 'updates',
            users: [],
            chats: [],
            seq: 0,
            updates: [{
              _: 'updateMessageID',
              random_id: randomIDS,
              id: updates.id
            }, {
              _: isChannel
                    ? 'updateNewChannelMessage'
                    : 'updateNewMessage',
              message: message,
              pts: updates.pts,
              pts_count: updates.pts_count
            }]
          };
        } else if(updates.updates) {
          updates.updates.forEach((update: any) => {
            if(update._ == 'updateDraftMessage') {
              update.local = true;
            }
          });
        }
        // Testing bad situations
        // var upd = angular.copy(updates)
        // updates.updates.splice(0, 1)

        apiUpdatesManager.processUpdateMessage(updates);

        // $timeout(function () {
        // ApiUpdatesManager.processUpdateMessage(upd)
        // }, 5000)
      }, (/* error: any */) => {
        toggleError(true);
      }).finally(() => {
        if(this.pendingAfterMsgs[peerID] === sentRequestOptions) {
          delete this.pendingAfterMsgs[peerID];
        }
      })

      this.pendingAfterMsgs[peerID] = sentRequestOptions;
    }

    this.saveMessages([message]);
    historyStorage.pending.unshift(messageID);
    $rootScope.$broadcast('history_append', {peerID: peerID, messageID: messageID, my: true});

    setTimeout(() => message.send(), 0);
    // setTimeout(function () {
    //   message.send()
    // }, 5000)

    /* if(options.clearDraft) { // WARNING
      DraftsManager.clearDraft(peerID)
    } */

    this.pendingByRandomID[randomIDS] = [peerID, messageID];
  }

  public sendFile(peerID: number, file: File | Blob | MTDocument, options: {
    isMedia?: boolean,
    replyToMsgID?: number,
    caption?: string,
    entities?: any[]
  } = {}) {
    peerID = AppPeersManager.getPeerMigratedTo(peerID) || peerID;
    var messageID = this.tempID--;
    var randomID = [nextRandomInt(0xFFFFFFFF), nextRandomInt(0xFFFFFFFF)];
    var randomIDS = bigint(randomID[0]).shiftLeft(32).add(bigint(randomID[1])).toString();
    var historyStorage = this.historiesStorage[peerID];
    var flags = 0;
    var pFlags: any = {};
    var replyToMsgID = options.replyToMsgID;
    var isChannel = AppPeersManager.isChannel(peerID);
    var isMegagroup = isChannel && AppPeersManager.isMegagroup(peerID);
    var asChannel = isChannel && !isMegagroup ? true : false;
    var attachType: string, apiFileName: string;

    let fileType = 'mime_type' in file ? file.mime_type : file.type;
    let fileName = file instanceof File ? file.name : '';
    let isDocument = !(file instanceof File) && !(file instanceof Blob);
    let caption = options.caption || '';

    if(caption) {
      let entities = options.entities || [];
      caption = RichTextProcessor.parseMarkdown(caption, entities);
    }

    if(!options.isMedia) {
      attachType = 'document';
      apiFileName = 'document.' + fileType.split('/')[1];
    } else if(isDocument) { // maybe it's a sticker
      attachType = 'document';
      apiFileName = '';
    } else if(['image/jpeg', 'image/png', 'image/bmp'].indexOf(fileType) >= 0) {
      attachType = 'photo';
      apiFileName = 'photo.' + fileType.split('/')[1];
    } else if(fileType.substr(0, 6) == 'audio/' || ['video/ogg'].indexOf(fileType) >= 0) {
      attachType = 'audio';
      apiFileName = 'audio.' + (fileType.split('/')[1] == 'ogg' ? 'ogg' : 'mp3');
    } else if(fileType.substr(0, 6) == 'video/') {
      attachType = 'video';
      apiFileName = 'video.mp4';
    } else {
      attachType = 'document';
      apiFileName = 'document.' + fileType.split('/')[1];
    }

    // console.log(attachType, apiFileName, file.type)

    if(historyStorage === undefined) {
      historyStorage = this.historiesStorage[peerID] = {count: null, history: [], pending: []};
    }

    var fromID = appUsersManager.getSelf().id;
    if(peerID != fromID) {
      flags |= 2;
      pFlags.out = true;

      if(!isChannel && !appUsersManager.isBot(peerID)) {
        flags |= 1;
        pFlags.unread = true;
      }
    }

    if(replyToMsgID) {
      flags |= 8;
    }

    if(asChannel) {
      fromID = 0;
      pFlags.post = true;
    } else {
      flags |= 256;
    }

    var media = {
      _: 'messageMediaPending',
      type: attachType,
      file_name: fileName || apiFileName,
      size: file.size,
      progress: {
        percent: 1, 
        total: file.size,
        done: 0,
        cancel: () => {}
      }
    };

    var message: any = {
      _: 'message',
      id: messageID,
      from_id: fromID,
      to_id: AppPeersManager.getOutputPeer(peerID),
      flags: flags,
      pFlags: pFlags,
      date: tsNow(true) + ServerTimeManager.serverTimeOffset,
      message: caption,
      media: isDocument ? {
        _: 'messageMediaDocument',
        pFlags: {},
        flags: 1,
        document: file 
      } : media,
      random_id: randomIDS,
      reply_to_msg_id: replyToMsgID,
      views: asChannel && 1,
      pending: true
    };

    var toggleError = (on: boolean) => {
      var historyMessage = this.messagesForHistory[messageID];
      if(on) {
        message.error = true;

        if(historyMessage) {
          historyMessage.error = true;
        }
      } else {
        delete message.error;

        if(historyMessage) {
          delete historyMessage.error;
        }
      }

      $rootScope.$broadcast('messages_pending');
    };

    var uploaded = false,
      uploadPromise: ReturnType<typeof apiFileManager.uploadFile> = null;

    let invoke = (flags: number, inputMedia: any) => {
      return MTProto.apiManager.invokeApi('messages.sendMedia', {
        flags: flags,
        peer: AppPeersManager.getInputPeerByID(peerID),
        media: inputMedia,
        message: caption,
        random_id: randomID,
        reply_to_msg_id: appMessagesIDsManager.getMessageLocalID(replyToMsgID)
      }).then((updates) => {
        apiUpdatesManager.processUpdateMessage(updates);
      }, (error) => {
        if(attachType == 'photo' &&
          error.code == 400 &&
          (error.type == 'PHOTO_INVALID_DIMENSIONS' ||
          error.type == 'PHOTO_SAVE_FILE_INVALID')) {
          error.handled = true
          attachType = 'document'
          message.send();
          return;
        }

        toggleError(true);
      });
    };

    message.send = () => {
      let flags = 0;
      if(replyToMsgID) {
        flags |= 1;
      }
      if(asChannel) {
        flags |= 16;
      }

      if(isDocument) {
        let {id, access_hash, file_reference} = file as MTDocument;

        let inputMedia = {
          _: 'inputMediaDocument',
          flags: 0,
          id: {
            _: 'inputDocument',
            id: id,
            access_hash: access_hash,
            file_reference: file_reference
          }
        };
        
        invoke(flags, inputMedia);
      } else if(file instanceof File || file instanceof Blob) {
        let deferredHelper: {
          resolve?: () => void,
          reject?: (error: any) => void
        } = {};
        let deferred: CancellablePromise<void> = new Promise((resolve, reject) => {
          deferredHelper.resolve = resolve;
          deferredHelper.reject = reject;
        });
        Object.assign(deferred, deferredHelper);

        this.sendFilePromise.then(() => {
          if(!uploaded || message.error) {
            uploaded = false;
            uploadPromise = apiFileManager.uploadFile(file);
          }
  
          uploadPromise && uploadPromise.then((inputFile) => {
            inputFile.name = apiFileName;
            uploaded = true;
            var inputMedia;
            switch(attachType) {
              case 'photo':
                inputMedia = {
                  _: 'inputMediaUploadedPhoto', 
                  flags: 0, 
                  file: inputFile
                };
                break;
  
              case 'document':
              default:
                inputMedia = {
                  _: 'inputMediaUploadedDocument', 
                  file: inputFile, 
                  mime_type: fileType, 
                  caption: '', 
                  attributes: [
                    {_: 'documentAttributeFilename', file_name: fileName}
                  ]
                };
            }
  
            invoke(flags, inputMedia);
          }, (/* error */) => {
            toggleError(true);
          });
  
          uploadPromise.notify = (progress: {done: number, total: number}) => {
            // console.log('upload progress', progress)
            media.progress.done = progress.done;
            media.progress.percent = Math.max(1, Math.floor(100 * progress.done / progress.total));
            $rootScope.$broadcast('history_update', {peerID: peerID});
          };
  
          media.progress.cancel = () => {
            if(!uploaded) {
              deferred.resolve();
              uploadPromise.cancel();
              this.cancelPendingMessage(randomIDS);
            }
          }
  
          // @ts-ignore
          uploadPromise['finally'](() => deferred.resolve());
        });

        this.sendFilePromise = deferred;
      }
    };

    this.saveMessages([message]);
    historyStorage.pending.unshift(messageID);
    $rootScope.$broadcast('history_append', {peerID: peerID, messageID: messageID, my: true});

    setTimeout(message.send.bind(this), 0);

    this.pendingByRandomID[randomIDS] = [peerID, messageID];
  }

  public cancelPendingMessage(randomID: string) {
    var pendingData = this.pendingByRandomID[randomID];

    console.log('pending', randomID, pendingData);

    if(pendingData) {
      var peerID = pendingData[0];
      var tempID = pendingData[1];
      var historyStorage = this.historiesStorage[peerID];
      var pos = historyStorage.pending.indexOf(tempID);

      apiUpdatesManager.processUpdateMessage({
        _: 'updateShort',
        update: {
          _: 'updateDeleteMessages',
          messages: [tempID]
        }
      });

      if(pos != -1) {
        historyStorage.pending.splice(pos, 1);
      }

      delete this.messagesForHistory[tempID];
      delete this.messagesStorage[tempID];

      return true;
    }

    return false;
  }

  public async getConversation(peerID: number) {
    var foundDialog = this.getDialogByPeerID(peerID)
    if(foundDialog.length) {
      return foundDialog[0];
    }

    return {
      peerID: peerID,
      top_message: 0,
      index: this.generateDialogIndex(this.generateDialogPinnedDate()),
      pFlags: {}
    };
  }

  public getConversations(query?: string, offsetIndex?: number, limit = 20) {
    var curDialogStorage = this.dialogsStorage;
    var isSearch = typeof(query) == 'string' && query.length;

    if(isSearch) {
      if(!limit || this.cachedResults.query !== query) {
        this.cachedResults.query = query

        var results: any = SearchIndexManager.search(query, this.dialogsIndex);

        this.cachedResults.dialogs = []
        this.dialogsStorage.dialogs.forEach((dialog: any) => {
          if(results[dialog.peerID]) {
            this.cachedResults.dialogs.push(dialog);
          }
        })
        this.cachedResults.count = this.cachedResults.dialogs.length;
      }
      curDialogStorage = this.cachedResults;
    } else {
      this.cachedResults.query = false;
    }

    var offset = 0
    if(offsetIndex > 0) {
      for(offset = 0; offset < curDialogStorage.dialogs.length; offset++) {
        if(offsetIndex > curDialogStorage.dialogs[offset].index) {
          break;
        }
      }
    }

    if(
      isSearch ||
      this.allDialogsLoaded ||
      curDialogStorage.dialogs.length >= offset + limit
    ) {
      return Promise.resolve({
        dialogs: curDialogStorage.dialogs.slice(offset, offset + limit)
      });
    }

    return this.getTopMessages(limit).then(() => {
      offset = 0
      if(offsetIndex > 0) {
        for(offset = 0; offset < curDialogStorage.dialogs.length; offset++) {
          if(offsetIndex > curDialogStorage.dialogs[offset].index) {
            break;
          }
        }
      }

      //console.warn(offset, offset + limit, curDialogStorage.dialogs.length, this.dialogsStorage.dialogs.length);

      return {
        dialogs: curDialogStorage.dialogs.slice(offset, offset + limit)
      };
    });
  }

  public getTopMessages(limit: number) {
    var dialogs = this.dialogsStorage.dialogs;
    var offsetDate = 0;
    var offsetID = 0;
    var offsetPeerID = 0;
    var offsetIndex = 0;
    var flags = 0;

    if(this.dialogsOffsetDate) {
      offsetDate = this.dialogsOffsetDate + MTProto.serverTimeManager.serverTimeOffset;
      offsetIndex = this.dialogsOffsetDate * 0x10000;
      flags |= 1;
    }

    let hash = 0;
    /* let id = 296814355;
    hash = (((hash * 0x4F25) & 0x7FFFFFFF) + id) & 0x7FFFFFFF; */

    return MTProto.apiManager.invokeApi('messages.getDialogs', {
      flags: flags,
      offset_date: offsetDate,
      offset_id: appMessagesIDsManager.getMessageLocalID(offsetID),
      offset_peer: AppPeersManager.getInputPeerByID(offsetPeerID),
      limit: limit,
      hash: hash
    }, {
      timeout: 300
    }).then((dialogsResult: any) => {
      if(!offsetDate) {
        telegramMeWebService.setAuthorized(true);
      }

      appUsersManager.saveApiUsers(dialogsResult.users);
      appChatsManager.saveApiChats(dialogsResult.chats);
      this.saveMessages(dialogsResult.messages);

      var maxSeenIdIncremented = offsetDate ? true : false;
      var hasPrepend = false;
      //dialogsResult.dialogs.reverse();
      let length = dialogsResult.dialogs.length;
      let noIDsDialogs: any = {};
      for(let i = length - 1; i >= 0; --i) {
        let dialog = dialogsResult.dialogs[i];
      //}
      //dialogsResult.dialogs.forEach((dialog: any) => {

        this.saveConversation(dialog);
        if(offsetIndex && dialog.index > offsetIndex) {
          this.newDialogsToHandle[dialog.peerID] = dialog;
          hasPrepend = true;
        }

        if(!dialog.read_inbox_max_id && !dialog.read_outbox_max_id) {
          noIDsDialogs[dialog.peerID] = dialog;
        }

        if(!maxSeenIdIncremented &&
            !AppPeersManager.isChannel(AppPeersManager.getPeerID(dialog.peer))) {
          this.incrementMaxSeenID(dialog.top_message);
          maxSeenIdIncremented = true;
        }
      }
      //});
      //dialogsResult.dialogs.reverse();

      if(Object.keys(noIDsDialogs).length) {
        //setTimeout(() => { // test bad situation
          this.reloadConversation(Object.keys(noIDsDialogs).map(id => +id)).then(() => {
            $rootScope.$broadcast('dialogs_multiupdate', noIDsDialogs);
  
            for(let peerID in noIDsDialogs) {
              $rootScope.$broadcast('dialog_unread', {peerID: +peerID});
            }
          });
        //}, 10e3);
      }

      if(!dialogsResult.dialogs.length ||
        !dialogsResult.count ||
        dialogs.length >= dialogsResult.count) {
        this.allDialogsLoaded = true;
      }

      if(hasPrepend && !this.newDialogsHandlePromise) {
        this.newDialogsHandlePromise = window.setTimeout(this.handleNewDialogs.bind(this), 0);
      } else {
        $rootScope.$broadcast('dialogs_multiupdate', {});
      }
    });
  }

  public generateDialogIndex(date?: any) {
    if(date === undefined) {
      date = tsNow(true) + MTProto.serverTimeManager.serverTimeOffset;
    }
    return (date * 0x10000) + ((++this.dialogsNum) & 0xFFFF);
  }

  public pushDialogToStorage(dialog: any, offsetDate?: any) {
    var dialogs = this.dialogsStorage.dialogs;
    var pos = this.getDialogByPeerID(dialog.peerID)[1];
    if(pos !== undefined) {
      dialogs.splice(pos, 1);
    }

    if(offsetDate &&
        !dialog.pFlags.pinned &&
        (!this.dialogsOffsetDate || offsetDate < this.dialogsOffsetDate)) {
      if(pos !== undefined) {
        // So the dialog jumped to the last position
        return false;
      }
      this.dialogsOffsetDate = offsetDate;
    }

    var index = dialog.index;
    var i;
    var len = dialogs.length;
    if(!len || index < dialogs[len - 1].index) {
      dialogs.push(dialog);
    } else if(index >= dialogs[0].index) {
      dialogs.unshift(dialog);
    } else {
      for(i = 0; i < len; i++) {
        if(index > dialogs[i].index) {
          dialogs.splice(i, 0, dialog);
          break;
        }
      }
    }
  }

  public getMessage(messageID: number) {
    return this.messagesStorage[messageID] || {
      _: 'messageEmpty',
      deleted: true,
      pFlags: {out: false, unread: false}
    };
  }

  public getMessagePeer(message: any): number {
    var toID = message.to_id && AppPeersManager.getPeerID(message.to_id) || 0;

    if(toID < 0) {
      return toID;
    } else if(message.pFlags && message.pFlags.out || message.flags & 2) {
      return toID;
    }
    return message.from_id;
  }

  public getDialogByPeerID(peerID: number) {
    let length = this.dialogsStorage.dialogs.length;
    for(var i = 0; i < length; i++) {
      if(this.dialogsStorage.dialogs[i].peerID == peerID) {
        return [this.dialogsStorage.dialogs[i], i];
      }
    }

    return [];
  }

  public reloadConversation(peerID: number | number[]) {
    let peers = [].concat(peerID).map(peerID => AppPeersManager.getInputPeerByID(peerID));

    console.log('will reloadConversation', peerID);

    return MTProto.apiManager.invokeApi('messages.getPeerDialogs', {
      peers: peers
    }).then(this.applyConversations.bind(this));
  }

  public saveMessages(apiMessages: any[], options: any = {}) {
    apiMessages.forEach((apiMessage) => {
      if(apiMessage.pFlags === undefined) {
        apiMessage.pFlags = {};
      }

      if(!apiMessage.pFlags.out) {
        apiMessage.pFlags.out = false;
      }

      if(!apiMessage.pFlags.unread) {
        apiMessage.pFlags.unread = false;
      }

      if(apiMessage._ == 'messageEmpty') {
        return;
      }

      var peerID = this.getMessagePeer(apiMessage);
      var isChannel = apiMessage.to_id._ == 'peerChannel';
      var channelID = isChannel ? -peerID : 0;
      var isBroadcast = isChannel && appChatsManager.isBroadcast(channelID);

      var mid = appMessagesIDsManager.getFullMessageID(apiMessage.id, channelID);
      apiMessage.mid = mid;

      var dialog = this.getDialogByPeerID(peerID)[0];
      if(dialog && mid > 0) {
        let dialogKey = apiMessage.pFlags.out
          ? 'read_outbox_max_id'
          : 'read_inbox_max_id';

        apiMessage.pFlags.unread = mid > dialog[dialogKey];
      } else if(options.isNew) {
        apiMessage.pFlags.unread = true;
      }
      // console.log(dT(), 'msg unread', mid, apiMessage.pFlags.out, dialog && dialog[apiMessage.pFlags.out ? 'read_outbox_max_id' : 'read_inbox_max_id'])

      if(apiMessage.reply_to_msg_id) {
        apiMessage.reply_to_mid = appMessagesIDsManager.getFullMessageID(apiMessage.reply_to_msg_id, channelID);
      }

      apiMessage.date -= MTProto.serverTimeManager.serverTimeOffset;

      apiMessage.peerID = peerID;
      apiMessage.fromID = apiMessage.pFlags.post ? peerID : apiMessage.from_id;

      var fwdHeader = apiMessage.fwd_from;
      if(fwdHeader) {
        if(peerID == appUsersManager.getSelf().id) {
          if(fwdHeader.saved_from_peer && fwdHeader.saved_from_msg_id) {
            var savedFromPeerID = AppPeersManager.getPeerID(fwdHeader.saved_from_peer);
            var savedFromMid = appMessagesIDsManager.getFullMessageID(fwdHeader.saved_from_msg_id, 
              AppPeersManager.isChannel(savedFromPeerID) ? -savedFromPeerID : 0);
            apiMessage.savedFrom = savedFromPeerID + '_' + savedFromMid;
          }

          apiMessage.fromID = fwdHeader.channel_id ? -fwdHeader.channel_id : fwdHeader.from_id;
        } else {
          apiMessage.fwdFromID = fwdHeader.channel_id ? -fwdHeader.channel_id : fwdHeader.from_id;
          apiMessage.fwdPostID = fwdHeader.channel_post;
        }

        fwdHeader.date -= MTProto.serverTimeManager.serverTimeOffset;
      }

      if(apiMessage.via_bot_id > 0) {
        apiMessage.viaBotID = apiMessage.via_bot_id;
      }

      var mediaContext = {
        user_id: apiMessage.fromID,
        date: apiMessage.date
      };

      if(apiMessage.media) {
        switch(apiMessage.media._) {
          case 'messageMediaEmpty':
            delete apiMessage.media;
            break;
          case 'messageMediaPhoto':
            if(apiMessage.media.ttl_seconds) {
              apiMessage.media = {_: 'messageMediaUnsupportedWeb'};
            } else {
              appPhotosManager.savePhoto(apiMessage.media.photo, mediaContext);
            }
            break
          case 'messageMediaDocument':
            if(apiMessage.media.ttl_seconds) {
              apiMessage.media = {_: 'messageMediaUnsupportedWeb'};
            } else {
              appDocsManager.saveDoc(apiMessage.media.document, mediaContext);
            }
            break;
          case 'messageMediaWebPage':
            if(apiMessage.media.webpage.document) {
              appDocsManager.saveDoc(apiMessage.media.webpage.document, mediaContext);
            }
            //AppWebPagesManager.saveWebPage(apiMessage.media.webpage, apiMessage.mid, mediaContext);
            break;
          /*case 'messageMediaWebPage':
            AppWebPagesManager.saveWebPage(apiMessage.media.webpage, apiMessage.mid, mediaContext);
            break;
          case 'messageMediaGame':
            AppGamesManager.saveGame(apiMessage.media.game, apiMessage.mid, mediaContext);
            apiMessage.media.handleMessage = true;
            break; */
          case 'messageMediaInvoice':
            apiMessage.media = {_: 'messageMediaUnsupportedWeb'};
            break;
          case 'messageMediaGeoLive':
            apiMessage.media._ = 'messageMediaGeo';
            break;
        }
      }

      if(apiMessage.action) {
        var migrateFrom;
        var migrateTo;
        switch (apiMessage.action._) {
          case 'messageActionChatEditPhoto':
            appPhotosManager.savePhoto(apiMessage.action.photo, mediaContext);
            if(isBroadcast) {
              apiMessage.action._ = 'messageActionChannelEditPhoto';
            }
            break;

          case 'messageActionChatEditTitle':
            if(isBroadcast) {
              apiMessage.action._ = 'messageActionChannelEditTitle';
            }
            break;

          case 'messageActionChatDeletePhoto':
            if(isBroadcast) {
              apiMessage.action._ = 'messageActionChannelDeletePhoto';
            }
            break;

          case 'messageActionChatAddUser':
            if(apiMessage.action.users.length == 1) {
              apiMessage.action.user_id = apiMessage.action.users[0];
              if(apiMessage.fromID == apiMessage.action.user_id) {
                if(isChannel) {
                  apiMessage.action._ = 'messageActionChatJoined';
                } else {
                  apiMessage.action._ = 'messageActionChatReturn';
                }
              }
            } else if(apiMessage.action.users.length > 1) {
              apiMessage.action._ = 'messageActionChatAddUsers';
            }
            break;

          case 'messageActionChatDeleteUser':
            if(apiMessage.fromID == apiMessage.action.user_id) {
              apiMessage.action._ = 'messageActionChatLeave';
            }
            break;

          case 'messageActionChannelMigrateFrom':
            migrateFrom = -apiMessage.action.chat_id;
            migrateTo = -channelID;
            break

          case 'messageActionChatMigrateTo':
            migrateFrom = -channelID;
            migrateTo = -apiMessage.action.channel_id;
            break;

          case 'messageActionHistoryClear':
            apiMessage.deleted = true;
            apiMessage.clear_history = true;
            apiMessage.pFlags.out = false;
            apiMessage.pFlags.unread = false;
            break;

          case 'messageActionPhoneCall':
            delete apiMessage.fromID;
            apiMessage.action.type = 
              (apiMessage.pFlags.out ? 'out_' : 'in_') +
              (
                apiMessage.action.reason._ == 'phoneCallDiscardReasonMissed' ||
                apiMessage.action.reason._ == 'phoneCallDiscardReasonBusy'
                   ? 'missed'
                   : 'ok'
              );
            break;
        }
        
        if(migrateFrom &&
            migrateTo &&
            !this.migratedFromTo[migrateFrom] &&
            !this.migratedToFrom[migrateTo]) {
          this.migrateChecks(migrateFrom, migrateTo);
        }
      }

      if(apiMessage.message && apiMessage.message.length) {
        var myEntities = RichTextProcessor.parseEntities(apiMessage.message);
        var apiEntities = apiMessage.entities || [];
        apiMessage.totalEntities = RichTextProcessor.mergeEntities(myEntities, apiEntities, !apiMessage.pending);
      }

      apiMessage.canBeEdited = this.canMessageBeEdited(apiMessage);

      if(!options.isEdited) {
        this.messagesStorage[mid] = apiMessage;
      }
    })
  }

  public migrateChecks(migrateFrom: any, migrateTo: any) {
    if(!this.migratedFromTo[migrateFrom] &&
      !this.migratedToFrom[migrateTo] &&
      appChatsManager.hasChat(-migrateTo)) {
      var fromChat = appChatsManager.getChat(-migrateFrom);
      if(fromChat &&
        fromChat.migrated_to &&
        fromChat.migrated_to.channel_id == -migrateTo) {
          this.migratedFromTo[migrateFrom] = migrateTo;
          this.migratedToFrom[migrateTo] = migrateFrom;

        setTimeout(() => {
          var foundDialog = this.getDialogByPeerID(migrateFrom);
          if(foundDialog.length) {
            this.dialogsStorage.dialogs.splice(foundDialog[1], 1);
            $rootScope.$broadcast('dialog_drop', {peerID: migrateFrom});
          }
          $rootScope.$broadcast('dialog_migrate', {migrateFrom: migrateFrom, migrateTo: migrateTo});
        }, 100);
      }
    }
  }

  public canMessageBeEdited(message: any) {
    var goodMedias = [
      'messageMediaPhoto',
      'messageMediaDocument',
      'messageMediaWebPage',
      'messageMediaPending'
    ]
    if(message._ != 'message' ||
        message.deleted ||
        message.fwd_from ||
        message.via_bot_id ||
        message.media && goodMedias.indexOf(message.media._) == -1 ||
        message.fromID && appUsersManager.isBot(message.fromID)) {
      return false;
    }
    if(message.media &&
        message.media._ == 'messageMediaDocument' &&
        message.media.document.sticker) {
      return false;
    }

    return true;
  }

  public applyConversations(dialogsResult: any) {
    appUsersManager.saveApiUsers(dialogsResult.users);
    appChatsManager.saveApiChats(dialogsResult.chats);
    this.saveMessages(dialogsResult.messages);

    //console.log('applyConversation', dialogsResult);

    var updatedDialogs: any = {};
    var hasUpdated = false;
    dialogsResult.dialogs.forEach((dialog: any) => {
      var peerID = AppPeersManager.getPeerID(dialog.peer);
      var topMessage = dialog.top_message;
      var topPendingMesage = this.pendingTopMsgs[peerID];
      if(topPendingMesage) {
        if(!topMessage || this.getMessage(topPendingMesage).date > this.getMessage(topMessage).date) {
          dialog.top_message = topMessage = topPendingMesage;
        }
      }

      if(topMessage) {
        var wasBefore = this.getDialogByPeerID(peerID).length > 0;
        this.saveConversation(dialog);
        if(wasBefore) {
          this.clearDialogCache(topMessage);
          $rootScope.$broadcast('dialog_top', dialog);
        } else {
          updatedDialogs[peerID] = dialog;
          hasUpdated = true;
        }
      } else {
        var foundDialog = this.getDialogByPeerID(peerID);
        if(foundDialog.length) {
          this.dialogsStorage.dialogs.splice(foundDialog[1], 1);
          $rootScope.$broadcast('dialog_drop', {peerID: peerID});
        }
      }

      if(this.newUpdatesAfterReloadToHandle[peerID] !== undefined) {
        for(let i in this.newUpdatesAfterReloadToHandle[peerID]) {
          let update = this.newUpdatesAfterReloadToHandle[peerID][i];
          this.handleUpdate(update);
        }

        delete this.newUpdatesAfterReloadToHandle[peerID];
      }
    });

    if(hasUpdated) {
      $rootScope.$broadcast('dialogs_multiupdate', updatedDialogs);
    }
  }

  public clearDialogCache(msgID: number) {
    delete this.messagesForDialogs[msgID];
  }

  public saveConversation(dialog: any) {
    var peerID = AppPeersManager.getPeerID(dialog.peer);
    if(!peerID) {
      return false;
    }
    var channelID = AppPeersManager.isChannel(peerID) ? -peerID : 0;
    var peerText = AppPeersManager.getPeerSearchText(peerID);
    SearchIndexManager.indexObject(peerID, peerText, this.dialogsIndex);

    //var isMegagroup = AppPeersManager.isMegagroup(channelID);
    if(dialog.top_message) {
      var mid = appMessagesIDsManager.getFullMessageID(dialog.top_message, channelID);
      var message = this.getMessage(mid);
    } else {
      var mid = this.tempID--;
      var message: any = {
        _: 'message',
        id: mid,
        mid: mid,
        from_id: appUsersManager.getSelf().id,
        to_id: AppPeersManager.getOutputPeer(peerID),
        deleted: true,
        flags: 0,
        pFlags: {unread: false, out: true},
        date: 0,
        message: ''
      }
      this.saveMessages([message]);
    }
    var offsetDate = message.date;

    if(!channelID && peerID < 0) {
      var chat = appChatsManager.getChat(-peerID)
      if(chat && chat.migrated_to && chat.pFlags.deactivated) {
        var migratedToPeer = AppPeersManager.getPeerID(chat.migrated_to)
        this.migratedFromTo[peerID] = migratedToPeer;
        this.migratedToFrom[migratedToPeer] = peerID;
        return;
      }
    }

    dialog.top_message = mid;
    dialog.read_inbox_max_id = appMessagesIDsManager.getFullMessageID(dialog.read_inbox_max_id, channelID);

    //peerID == 228260936 && console.log('we get drunk', dialog, dialog.read_outbox_max_id);
    dialog.read_outbox_max_id = appMessagesIDsManager.getFullMessageID(dialog.read_outbox_max_id, channelID);
    //peerID == 228260936 && console.log('we get high', dialog, dialog.read_outbox_max_id);

    var topDate = message.date;
    if(channelID) {
      var channel = appChatsManager.getChat(channelID);
      if(!topDate || channel.date && channel.date > topDate) {
        topDate = channel.date;
      }
    }
    var savedDraft: any = {};// DraftsManager.saveDraft(peerID, dialog.draft); // warning
    if(savedDraft && savedDraft.date > topDate) {
      topDate = savedDraft.date;
    }
    if(dialog.pFlags.pinned) {
      topDate = this.generateDialogPinnedDate();
    }

    dialog.index = this.generateDialogIndex(topDate);
    dialog.peerID = peerID;

    this.pushDialogToStorage(dialog, offsetDate);

    // Because we saved message without dialog present
    var unreadKey = message.pFlags.out ? 'read_outbox_max_id' : 'read_inbox_max_id';
    if(message.mid > 0) {
      if(message.mid > dialog[unreadKey]) message.pFlags.unread = true;
      else message.pFlags.unread = false;
    }

    if(this.historiesStorage[peerID] === undefined && !message.deleted) {
      var historyStorage: any = {count: null, history: [], pending: []};
      historyStorage[mid > 0 ? 'history' : 'pending'].push(mid)
      if(mid < 0 && message.pFlags.unread) {
        dialog.unread_count++;
      }
      this.historiesStorage[peerID] = historyStorage
      if(this.mergeReplyKeyboard(historyStorage, message)) {
        $rootScope.$broadcast('history_reply_markup', {peerID: peerID});
      }
    }

    //NotificationsManager.savePeerSettings(peerID, dialog.notify_settings); // warning

    /* if(dialog.pts || dialog.pFlags.pts) {
      console.warn('dialog pts!', dialog, dialog.pts);
    } */

    if(channelID && dialog.pts) {
      apiUpdatesManager.addChannelState(channelID, dialog.pts);
    }

    /*if(Config.Modes.packed && !channelID && dialog.unread_count > 0 &&
      this.maxSeenID && dialog.top_message > this.maxSeenID &&
      message.pFlags.unread && !message.pFlags.out) {
       var notifyPeer = message.flags & 16 ? message.from_id : peerID
      NotificationsManager.getPeerMuted(notifyPeer).then((muted: any) => {
        if(!muted) {
          this.notifyAboutMessage(message);
        }
      }); 
    }*/ // WARNING
  }

  public handleNotifications() {
    clearTimeout(this.notificationsHandlePromise);
    this.notificationsHandlePromise = 0;

    var timeout = $rootScope.idle.isIDLE /* && StatusManager.isOtherDeviceActive() */ ? 30000 : 1000;
    Object.keys(this.notificationsToHandle).forEach((key: any) => {
      let notifyPeerToHandle = this.notificationsToHandle[key];
      notifyPeerToHandle.isMutedPromise.then((muted: boolean) => {
        var topMessage = notifyPeerToHandle.top_message
        if(muted ||
          !topMessage.pFlags.unread) {
          return;
        }

        setTimeout(() => {
          if(topMessage.pFlags.unread) {
            this.notifyAboutMessage(topMessage, {
              fwd_count: notifyPeerToHandle.fwd_count
            });
          }
        }, timeout);
      });
    });

    this.notificationsToHandle = {};
  }

  public notifyAboutMessage(message: any, options: any = {}) {
    var peerID = this.getMessagePeer(message);
    var peerString: string;
    var notification: any = {};
    var notificationMessage = '',
      notificationPhoto;

    var notifySettings: any = {}; //NotificationsManager.getNotifySettings(); // warning

    if(message.fwdFromID && options.fwd_count) {
      notificationMessage = options.fwd_count;// this.fwdMessagesPluralize(options.fwd_count); // warning
    } else if(message.message) {
      if(notifySettings.nopreview) {
        notificationMessage = 'conversation_message_sent';
      } else {
        notificationMessage = RichTextProcessor.wrapPlainText(message.message);
      }
    } else if(message.media) {
      var captionEmoji = '';
      switch (message.media._) {
        case 'messageMediaPhoto':
          notificationMessage = _('conversation_media_photo_raw');
          captionEmoji = 'рџ–ј';
          break
        case 'messageMediaDocument':
          switch (message.media.document.type) {
            case 'gif':
              notificationMessage = _('conversation_media_gif_raw');
              captionEmoji = 'рџЋ¬'
              break
            case 'sticker':
              notificationMessage = _('conversation_media_sticker');
              var stickerEmoji = message.media.document.stickerEmojiRaw;
              if(stickerEmoji !== undefined) {
                notificationMessage = RichTextProcessor.wrapPlainText(stickerEmoji) + ' ' + notificationMessage;
              }
              break;
            case 'video':
              notificationMessage = _('conversation_media_video_raw');
              captionEmoji = 'рџ“№';
              break;
            case 'round':
              notificationMessage = _('conversation_media_round_raw');
              captionEmoji = 'рџ“№';
              break;
            case 'voice':
            case 'audio':
              notificationMessage = _('conversation_media_audio_raw');
              break;
            default:
              if(message.media.document.file_name) {
                notificationMessage = RichTextProcessor.wrapPlainText('рџ“Ћ ' + message.media.document.file_name);
              } else {
                notificationMessage = _('conversation_media_document_raw');
                captionEmoji = 'рџ“Ћ';
              }
              break;
          }
          break;

        case 'messageMediaGeo':
        case 'messageMediaVenue':
          notificationMessage = _('conversation_media_location_raw');
          captionEmoji = 'рџ“Ќ';
          break;
        case 'messageMediaContact':
          notificationMessage = _('conversation_media_contact_raw');
          break;
        case 'messageMediaGame':
          notificationMessage = RichTextProcessor.wrapPlainText('рџЋ® ' + message.media.game.title);
          break;
        case 'messageMediaUnsupported':
          notificationMessage = _('conversation_media_unsupported_raw');
          break;
        default:
          notificationMessage = _('conversation_media_attachment_raw');
          break;
      }

      if(captionEmoji != '' &&
          message.media.caption) {
        notificationMessage = RichTextProcessor.wrapPlainText(captionEmoji + ' ' + message.media.caption);
      }
    } else if(message._ == 'messageService') {
      switch(message.action._) {
        case 'messageActionChatCreate':
          notificationMessage = _('conversation_group_created_raw');
          break
        case 'messageActionChatEditTitle':
          notificationMessage = _('conversation_group_renamed_raw');
          break
        case 'messageActionChatEditPhoto':
          notificationMessage = _('conversation_group_photo_updated_raw');
          break
        case 'messageActionChatDeletePhoto':
          notificationMessage = _('conversation_group_photo_removed_raw');
          break
        case 'messageActionChatAddUser':
        case 'messageActionChatAddUsers':
          notificationMessage = _('conversation_invited_user_message_raw');
          break
        case 'messageActionChatReturn':
          notificationMessage = _('conversation_returned_to_group_raw');
          break
        case 'messageActionChatJoined':
          notificationMessage = _('conversation_joined_group_raw');
          break
        case 'messageActionChatDeleteUser':
          notificationMessage = _('conversation_kicked_user_message_raw');
          break
        case 'messageActionChatLeave':
          notificationMessage = _('conversation_left_group_raw');
          break
        case 'messageActionChatJoinedByLink':
          notificationMessage = _('conversation_joined_by_link_raw');
          break
        case 'messageActionChannelCreate':
          notificationMessage = _('conversation_created_channel_raw');
          break
        case 'messageActionChannelEditTitle':
          notificationMessage = _('conversation_changed_channel_name_raw');
          break
        case 'messageActionChannelEditPhoto':
          notificationMessage = _('conversation_changed_channel_photo_raw')
          break
        case 'messageActionChannelDeletePhoto':
          notificationMessage = _('conversation_removed_channel_photo_raw')
          break
        case 'messageActionPinMessage':
          notificationMessage = _('conversation_pinned_message_raw')
          break
        case 'messageActionGameScore':
          notificationMessage = message.action.score;//this.gameScorePluralize(message.action.score); // warning
          break

        case 'messageActionPhoneCall':
          switch(message.action.type) {
            case 'out_missed':
              notificationMessage = _('message_service_phonecall_canceled_raw')
              break
            case 'in_missed':
              notificationMessage = _('message_service_phonecall_missed_raw')
              break
            case 'out_ok':
              notificationMessage = _('message_service_phonecall_outgoing_raw')
              break
            case 'in_ok':
              notificationMessage = _('message_service_phonecall_incoming_raw')
              break
          }
          break
      }
    }

    if(peerID > 0) {
      var fromUser = appUsersManager.getUser(message.from_id);
      var fromPhoto = appUsersManager.getUserPhoto(message.from_id);

      notification.title = (fromUser.first_name || '') +
        (fromUser.first_name && fromUser.last_name ? ' ' : '') +
        (fromUser.last_name || '')
      if(!notification.title) {
        notification.title = fromUser.phone || _('conversation_unknown_user_raw')
      }

      notificationPhoto = fromPhoto

      peerString = appUsersManager.getUserString(peerID)
    } else {
      notification.title = appChatsManager.getChat(-peerID).title || _('conversation_unknown_chat_raw')

      if(message.from_id > 0) {
        var fromUser = appUsersManager.getUser(message.from_id)
        notification.title = (fromUser.first_name || fromUser.last_name || _('conversation_unknown_user_raw')) +
        ' @ ' +
        notification.title
      }

      notificationPhoto = appChatsManager.getChatPhoto(-peerID)

      peerString = appChatsManager.getChatString(-peerID)
    }

    notification.title = RichTextProcessor.wrapPlainText(notification.title)

    notification.onclick = function () {
      $rootScope.$broadcast('history_focus', {
        peerString: peerString,
        messageID: message.flags & 16 ? message.mid : 0
      })
    }

    notification.message = notificationMessage
    notification.key = 'msg' + message.mid
    notification.tag = peerString
    notification.silent = message.pFlags.silent || false

    if(notificationPhoto.location && !notificationPhoto.location.empty) {
      MTProto.apiFileManager.downloadSmallFile(notificationPhoto.location/* , notificationPhoto.size */)
      .then((blob) => {
        if(message.pFlags.unread) {
          notification.image = blob
          // NotificationsManager.notify(notification) // warning
        }
      })
    } else {
      // NotificationsManager.notify(notification) // warning
    }
  }

  public mergeReplyKeyboard(historyStorage: any, message: any) {
    // console.log('merge', message.mid, message.reply_markup, historyStorage.reply_markup)
    if(!message.reply_markup &&
      !message.pFlags.out &&
      !message.action) {
      return false;
    }
    if(message.reply_markup &&
      message.reply_markup._ == 'replyInlineMarkup') {
      return false;
    }
    var messageReplyMarkup = message.reply_markup;
    var lastReplyMarkup = historyStorage.reply_markup;
    if(messageReplyMarkup) {
      if(lastReplyMarkup && lastReplyMarkup.mid >= message.mid) {
        return false;
      }

      if(messageReplyMarkup.pFlags.selective &&
        !(message.flags & 16)) {
        return false;
      }

      if(historyStorage.maxOutID &&
        message.mid < historyStorage.maxOutID &&
        messageReplyMarkup.pFlags.single_use) {
        messageReplyMarkup.pFlags.hidden = true;
      }
      messageReplyMarkup = Object.assign({
        mid: message.mid
      }, messageReplyMarkup);
      if(messageReplyMarkup._ != 'replyKeyboardHide') {
        messageReplyMarkup.fromID = message.from_id;
      }
      historyStorage.reply_markup = messageReplyMarkup;
      // console.log('set', historyStorage.reply_markup)
      return true;
    }

    if(message.pFlags.out) {
      if(lastReplyMarkup) {
        if(lastReplyMarkup.pFlags.single_use &&
          !lastReplyMarkup.pFlags.hidden &&
          (message.mid > lastReplyMarkup.mid || message.mid < 0) &&
          message.message) {
          lastReplyMarkup.pFlags.hidden = true;
          // console.log('set', historyStorage.reply_markup)
          return true;
        }
      } else if(!historyStorage.maxOutID ||
        message.mid > historyStorage.maxOutID) {
        historyStorage.maxOutID = message.mid;
      }
    }

    if(message.action &&
      message.action._ == 'messageActionChatDeleteUser' &&
      (lastReplyMarkup
        ? message.action.user_id == lastReplyMarkup.fromID
        : appUsersManager.isBot(message.action.user_id)
      )
    ) {
      historyStorage.reply_markup = {
        _: 'replyKeyboardHide',
        mid: message.mid,
        flags: 0,
        pFlags: {}
      };
      // console.log('set', historyStorage.reply_markup)
      return true;
    }

    return false;
  }

  public getSearch(peerID = 0, query: string = '', inputFilter: {
    _?: string
  } = {_: 'inputMessagesFilterEmpty'}, maxID: number, limit: number, offsetRate = 0): Promise<{
    count: number,
    next_rate: number,
    history: number[]
  }> {
    //peerID = peerID ? parseInt(peerID) : 0;
    var foundMsgs: number[] = [];
    var useSearchCache = !query;
    var newSearchFilter = {peer: peerID, filter: inputFilter};
    var sameSearchCache = useSearchCache 
      && deepEqual(this.lastSearchFilter, newSearchFilter); //angular.equals(this.lastSearchFilter, newSearchFilter);

    if(useSearchCache && !sameSearchCache) {
      // console.warn(dT(), 'new search filter', lastSearchFilter, newSearchFilter)
      this.lastSearchFilter = newSearchFilter;
      this.lastSearchResults = [];
    }

    console.log(dT(), 'search', useSearchCache, sameSearchCache, this.lastSearchResults, maxID);

    if(peerID && !maxID && !query) {
      var historyStorage = this.historiesStorage[peerID];

      if(historyStorage !== undefined && historyStorage.history.length) {
        var neededContents: {
          [type: string]: boolean
        } = {},
          neededDocType: string | boolean;
        var neededLimit = limit || 20;
        var message;

        switch(inputFilter._) {
          case 'inputMessagesFilterPhotos':
            neededContents['messageMediaPhoto'] = true;
            break;

          case 'inputMessagesFilterPhotoVideo':
            neededContents['messageMediaPhoto'] = true;
            neededContents['messageMediaDocument'] = true;
            neededDocType = 'video';
            break;

          case 'inputMessagesFilterVideo':
            neededContents['messageMediaDocument'] = true;
            neededDocType = 'video';
            break;

          case 'inputMessagesFilterDocument':
            neededContents['messageMediaDocument'] = true;
            neededDocType = false;
            break;

          case 'inputMessagesFilterVoice':
            neededContents['messageMediaDocument'] = true;
            neededDocType = 'voice';
            break;

          case 'inputMessagesFilterRoundVideo':
            neededContents['messageMediaDocument'] = true;
            neededDocType = 'round';
            break;

          case 'inputMessagesFilterMusic':
            neededContents['messageMediaDocument'] = true;
            neededDocType = 'audio';
            break;

          case 'inputMessagesFilterUrl':
            neededContents['url'] = true;
            break;

          case 'inputMessagesFilterMyMentions':
            neededContents['mentioned'] = true;
            break;

          default:
            return Promise.resolve({
              count: 0,
              next_rate: 0,
              history: [] as number[]
            });
        }

        for(let i = 0; i < historyStorage.history.length; i++) {
          message = this.messagesStorage[historyStorage.history[i]];
          if(message.media && neededContents[message.media._]) {
            if(neededDocType !== undefined &&
                message.media._ == 'messageMediaDocument' &&
                message.media.document.type != neededDocType) {
              continue;
            }

            foundMsgs.push(message.mid);
            if(foundMsgs.length >= neededLimit) {
              break;
            }
          }
        }
      }

      // console.warn(dT(), 'before append', foundMsgs)
      if(foundMsgs.length < neededLimit && this.lastSearchResults.length && sameSearchCache) {
        var minID = foundMsgs.length ? foundMsgs[foundMsgs.length - 1] : false;
        for(let i = 0; i < this.lastSearchResults.length; i++) {
          if(minID === false || this.lastSearchResults[i] < minID) {
            foundMsgs.push(this.lastSearchResults[i]);
            if(foundMsgs.length >= neededLimit) {
              break;
            }
          }
        }
      }
      // console.warn(dT(), 'after append', foundMsgs)
    }

    if(foundMsgs.length || limit == 1000) {
      if(useSearchCache) {
        this.lastSearchResults = listMergeSorted(this.lastSearchResults, foundMsgs)
      }

      return Promise.resolve({
        count: 0,
        next_rate: 0,
        history: foundMsgs
      });
    }

    var apiPromise

    if(peerID || !query) {
      apiPromise = MTProto.apiManager.invokeApi('messages.search', {
        flags: 0,
        peer: AppPeersManager.getInputPeerByID(peerID),
        q: query || '',
        filter: inputFilter || {_: 'inputMessagesFilterEmpty'},
        min_date: 0,
        max_date: 0,
        limit: limit || 20,
        offset_id: appMessagesIDsManager.getMessageLocalID(maxID) || 0,
        add_offset: 0,
        max_id: 0,
        min_id: 0
      }, {
        timeout: 300,
        noErrorBox: true
      });
    } else {
      var offsetDate = 0;
      var offsetPeerID = 0;
      var offsetID = 0;
      var offsetMessage = maxID && this.getMessage(maxID);

      if(offsetMessage && offsetMessage.date) {
        offsetDate = offsetMessage.date + ServerTimeManager.serverTimeOffset;
        offsetID = offsetMessage.id;
        offsetPeerID = this.getMessagePeer(offsetMessage);
      }

      apiPromise = MTProto.apiManager.invokeApi('messages.searchGlobal', {
        q: query,
        offset_rate: offsetRate,
        offset_peer: AppPeersManager.getInputPeerByID(offsetPeerID),
        offset_id: appMessagesIDsManager.getMessageLocalID(offsetID),
        limit: limit || 20
      }, {
        timeout: 300,
        noErrorBox: true
      });
    }

    return apiPromise.then((searchResult: any) => {
      appUsersManager.saveApiUsers(searchResult.users);
      appChatsManager.saveApiChats(searchResult.chats);
      this.saveMessages(searchResult.messages);

      console.log('messages.search result:', searchResult);

      var foundCount: number = searchResult.count || searchResult.messages.length;

      foundMsgs = [];
      searchResult.messages.forEach((message: any) => {
        var peerID = this.getMessagePeer(message);
        if(peerID < 0) {
          var chat = appChatsManager.getChat(-peerID);
          if(chat.migrated_to) {
            this.migrateChecks(peerID, -chat.migrated_to.channel_id);
          }
        }
        foundMsgs.push(message.mid);
      });

      if(useSearchCache &&
          (!maxID || sameSearchCache && this.lastSearchResults.indexOf(maxID) >= 0)) {
        this.lastSearchResults = listMergeSorted(this.lastSearchResults, foundMsgs);
      }
      // console.log(dT(), 'after API', foundMsgs, lastSearchResults)

      return {
        count: foundCount,
        next_rate: searchResult.next_rate,
        history: foundMsgs
      };
    }, (error) => {
      if(error.code == 400) {
        error.handled = true;
      }

      return Promise.reject(error);
    });
  }
  
  public generateDialogPinnedDate() {
    return 0x7fffff00 + ((this.pinnedIndex++) & 0xff);
  }

  public handleNewMessages() {
    clearTimeout(this.newMessagesHandlePromise);
    this.newMessagesHandlePromise = 0;

    $rootScope.$broadcast('history_multiappend', this.newMessagesToHandle);
    this.newMessagesToHandle = {};
  }

  public handleNewDialogs() {
    clearTimeout(this.newDialogsHandlePromise);
    this.newDialogsHandlePromise = 0;
    
    var newMaxSeenID = 0
    Object.keys(this.newDialogsToHandle).forEach((peerID) => {
      let dialog = this.newDialogsToHandle[peerID];
      if(dialog.reload) {
        this.reloadConversation(+peerID);
        delete this.newDialogsToHandle[peerID];
      } else {
        this.pushDialogToStorage(dialog);
        if(!AppPeersManager.isChannel(+peerID)) {
          newMaxSeenID = Math.max(newMaxSeenID, dialog.top_message || 0);
        }
      }
    })

    if(newMaxSeenID != 0) {
      this.incrementMaxSeenID(newMaxSeenID);
    }

    $rootScope.$broadcast('dialogs_multiupdate', this.newDialogsToHandle);
    this.newDialogsToHandle = {};
  }

  public readHistory(peerID: number, maxID = 0, minID = 0) {
    // console.trace('start read')
    var isChannel = AppPeersManager.isChannel(peerID);
    var historyStorage = this.historiesStorage[peerID];
    var foundDialog = this.getDialogByPeerID(peerID)[0];

    if(!foundDialog || !foundDialog.unread_count) {
      if(!historyStorage || !historyStorage.history.length) {
        return false;
      }

      let messageID, message;
      let foundUnread = false;
      for(let i = historyStorage.history.length; i >= 0; i--) {
        messageID = historyStorage.history[i];
        message = this.messagesStorage[messageID];
        if(message && !message.pFlags.out && message.pFlags.unread) {
          foundUnread = true;
          break;
        }
      }

      if(!foundUnread) {
        return false;
      }
    }

    if(historyStorage.readPromise) {
      return historyStorage.readPromise;
    }

    var apiPromise: any;
    if(isChannel) {
      apiPromise = MTProto.apiManager.invokeApi('channels.readHistory', {
        channel: appChatsManager.getChannelInput(-peerID),
        max_id: maxID
      });
    } else {
      apiPromise = MTProto.apiManager.invokeApi('messages.readHistory', {
        peer: AppPeersManager.getInputPeerByID(peerID),
        max_id: maxID
      }).then((affectedMessages: any) => {
        apiUpdatesManager.processUpdateMessage({
          _: 'updateShort',
          update: {
            _: 'updatePts',
            pts: affectedMessages.pts,
            pts_count: affectedMessages.pts_count
          }
        });
      });
    }

    historyStorage.readPromise = apiPromise.then(() => {
      if(foundDialog) {
        // console.log('done read history', peerID)

        let index = -1;
        if(maxID != 0 && historyStorage && historyStorage.history.length) {
          index = historyStorage.history.findIndex((mid: number) => mid == maxID);
        }

        foundDialog.unread_count = index == -1 ? 0 : index;
        console.log('readHistory set unread_count to:', foundDialog.unread_count, foundDialog);
        $rootScope.$broadcast('dialog_unread', {peerID: peerID, count: foundDialog.unread_count});
        $rootScope.$broadcast('messages_read');
        if(historyStorage && historyStorage.history.length) {
          console.warn('readPromise:', index, historyStorage.history[index != -1 ? index : 0]);
          foundDialog.read_inbox_max_id = historyStorage.history[index != -1 ? index : 0];
        }
      }
      /* if(foundDialog) {
        // console.log('done read history', peerID)
        foundDialog.unread_count = 0
        $rootScope.$broadcast('dialog_unread', {peerID: peerID, count: 0})
        $rootScope.$broadcast('messages_read')
        if(historyStorage && historyStorage.history.length) {
          foundDialog.read_inbox_max_id = historyStorage.history[0]
        }
      } */
    }).finally(() => {
      delete historyStorage.readPromise;
    });

    if(historyStorage && historyStorage.history.length) {
      let messageID: number;
      let message, i;
      for(i = 0; i < historyStorage.history.length; i++) {
        messageID = historyStorage.history[i];

        message = this.messagesStorage[messageID];
        if(message && !message.pFlags.out) {
          message.pFlags.unread = false;

          if(this.messagesForHistory[messageID]) {
            this.messagesForHistory[messageID].pFlags.unread = false;
          }

          if(this.messagesForDialogs[messageID]) {
            this.messagesForDialogs[messageID].pFlags.unread = false;
          }
          //NotificationsManager.cancel('msg' + messageID); // warning
        }

        if(messageID == minID) break;
      }
    }

    // NotificationsManager.soundReset(AppPeersManager.getPeerString(peerID)) // warning

    return historyStorage.readPromise;
  }

  public readMessages(messageIDs: number[]) {
    var splitted = appMessagesIDsManager.splitMessageIDsByChannels(messageIDs);
    Object.keys(splitted.msgIDs).forEach((channelID: number | string) => {
      channelID = +channelID;
      let msgIDs = splitted.msgIDs[channelID];

      if(channelID > 0) {
        MTProto.apiManager.invokeApi('channels.readMessageContents', {
          channel: appChatsManager.getChannelInput(channelID),
          id: msgIDs
        }).then(() => {
          apiUpdatesManager.processUpdateMessage({
            _: 'updateShort',
            update: {
              _: 'updateChannelReadMessagesContents',
              channel_id: channelID,
              messages: msgIDs
            }
          });
        });
      } else {
        MTProto.apiManager.invokeApi('messages.readMessageContents', {
          id: msgIDs
        }).then((affectedMessages: any) => {
          apiUpdatesManager.processUpdateMessage({
            _: 'updateShort',
            update: {
              _: 'updateReadMessagesContents',
              messages: msgIDs,
              pts: affectedMessages.pts,
              pts_count: affectedMessages.pts_count
            }
          });
        });
      }
    });
  }

  public handleUpdate(update: any) {
    console.log('AMM: handleUpdate:', update._);
    switch(update._) {
      case 'updateMessageID': {
        var randomID = update.random_id;
        var pendingData = this.pendingByRandomID[randomID];
        if(pendingData) {
          var peerID: number = pendingData[0];
          var tempID = pendingData[1];
          var channelID = AppPeersManager.isChannel(peerID) ? -peerID : 0;
          var mid = appMessagesIDsManager.getFullMessageID(update.id, channelID);
          var message = this.messagesStorage[mid];
          if(message) {
            var historyStorage = this.historiesStorage[peerID];
            var pos = historyStorage.pending.indexOf(tempID);
            if(pos != -1) {
              historyStorage.pending.splice(pos, 1);
            }
            delete this.messagesForHistory[tempID];
            delete this.messagesStorage[tempID];

            var msgs: any = {}
            msgs[tempID] = true;

            $rootScope.$broadcast('history_delete', {peerID: peerID, msgs: msgs});

            this.finalizePendingMessageCallbacks(tempID, mid);
          } else {
            this.pendingByMessageID[mid] = randomID;
          }
        }
        break;
      }

      case 'updateNewMessage':
      case 'updateNewChannelMessage': {
        var message = update.message;
        var peerID = this.getMessagePeer(message);
        var historyStorage = this.historiesStorage[peerID];
        var foundDialog = this.getDialogByPeerID(peerID);

        if(!foundDialog.length) {
          this.newDialogsToHandle[peerID] = {reload: true}
          if(!this.newDialogsHandlePromise) {
            this.newDialogsHandlePromise = window.setTimeout(this.handleNewDialogs.bind(this), 0);
          }
          if(this.newUpdatesAfterReloadToHandle[peerID] === undefined) {
            this.newUpdatesAfterReloadToHandle[peerID] = [];
          }
          this.newUpdatesAfterReloadToHandle[peerID].push(update);
          break;
        }

        if(update._ == 'updateNewChannelMessage') {
          var chat = appChatsManager.getChat(-peerID);
          if(chat.pFlags && (chat.pFlags.left || chat.pFlags.kicked)) {
            break;
          }
        }

        this.saveMessages([message], {isNew: true});
        // console.warn(dT(), 'message unread', message.mid, message.pFlags.unread)

        if(historyStorage === undefined) {
          historyStorage = this.historiesStorage[peerID] = {
            count: null,
            history: [],
            pending: []
          };
        }

        var history = message.mid > 0 ? historyStorage.history : historyStorage.pending;
        if(history.indexOf(message.mid) != -1) {
          return false;
        }
        var topMsgID = history[0];
        history.unshift(message.mid);
        if(message.mid > 0 && message.mid < topMsgID) {
          history.sort((a: any, b: any) => {
            return b - a;
          });
        }

        if(message.mid > 0 &&
            historyStorage.count !== null) {
          historyStorage.count++;
        }

        if(this.mergeReplyKeyboard(historyStorage, message)) {
          $rootScope.$broadcast('history_reply_markup', {peerID: peerID});
        }

        if(!message.pFlags.out && message.from_id) {
          appUsersManager.forceUserOnline(message.from_id);
        }

        var randomID = this.pendingByMessageID[message.mid],
          pendingMessage;

        if(randomID) {
          if(pendingMessage = this.finalizePendingMessage(randomID, message)) {
            $rootScope.$broadcast('history_update', {peerID: peerID});
          }

          delete this.pendingByMessageID[message.mid];
        }

        if(!pendingMessage) {
          if(this.newMessagesToHandle[peerID] === undefined) {
            this.newMessagesToHandle[peerID] = [];
          }

          this.newMessagesToHandle[peerID].push(message.mid);
          if(!this.newMessagesHandlePromise) {
            this.newMessagesHandlePromise = window.setTimeout(this.handleNewMessages.bind(this), 0);
          }
        }

        var inboxUnread = !message.pFlags.out && message.pFlags.unread;
        var dialog = foundDialog[0];
        dialog.top_message = message.mid;
        if(inboxUnread) {
          dialog.unread_count++;
        }
        if(!dialog.pFlags.pinned || !dialog.index) {
          dialog.index = this.generateDialogIndex(message.date);
        }

        this.newDialogsToHandle[peerID] = dialog;
        if(!this.newDialogsHandlePromise) {
          this.newDialogsHandlePromise = window.setTimeout(this.handleNewDialogs.bind(this), 0);
        }

        if(inboxUnread &&
            ($rootScope.selectedPeerID != peerID || $rootScope.idle.isIDLE)) {
          var notifyPeer = message.flags & 16 ? message.from_id : peerID;
          var notifyPeerToHandle = this.notificationsToHandle[notifyPeer];
          if(notifyPeerToHandle === undefined) {
            notifyPeerToHandle = this.notificationsToHandle[notifyPeer] = {
              isMutedPromise: Promise.resolve()/* NotificationsManager.getPeerMuted(notifyPeer) */, // WARNING
              fwd_count: 0,
              from_id: 0
            };
          }

          if(notifyPeerToHandle.from_id != message.from_id) {
            notifyPeerToHandle.from_id = message.from_id;
            notifyPeerToHandle.fwd_count = 0;
          }
          if(message.fwdFromID) {
            notifyPeerToHandle.fwd_count++;
          }

          notifyPeerToHandle.top_message = message;

          if(!this.notificationsHandlePromise) {
            this.notificationsHandlePromise = window.setTimeout(this.handleNotifications.bind(this), 1000);
          }
        }
        break;
      }

      case 'updateDialogPinned': {
        var peerID = AppPeersManager.getPeerID(update.peer);
        var foundDialog = this.getDialogByPeerID(peerID);

        if(!foundDialog.length || !update.pFlags.pinned) {
          this.newDialogsToHandle[peerID] = {reload: true};
          if(!this.newDialogsHandlePromise) {
            this.newDialogsHandlePromise = window.setTimeout(this.handleNewDialogs.bind(this), 0);
          }
          break;
        }

        var dialog = foundDialog[0];
        dialog.index = this.generateDialogIndex(this.generateDialogPinnedDate());
        dialog.pFlags.pinned = true;
        break;
      }

      case 'updatePinnedDialogs': {
        var newPinned: any = {};
        if(!update.order) {
          MTProto.apiManager.invokeApi('messages.getPinnedDialogs', {}).then((dialogsResult: any) => {
            dialogsResult.dialogs.reverse();
            this.applyConversations(dialogsResult);

            dialogsResult.dialogs.forEach((dialog: any) => {
              newPinned[dialog.peerID] = true;
            });

            this.dialogsStorage.dialogs.forEach((dialog: any) => {
              var peerID = dialog.peerID;
              if(dialog.pFlags.pinned && !newPinned[peerID]) {
                this.newDialogsToHandle[peerID] = {reload: true};
                if(!this.newDialogsHandlePromise) {
                  this.newDialogsHandlePromise = window.setTimeout(this.handleNewDialogs.bind(this), 0);
                }
              }
            });
          });
          break;
        }

        update.order.reverse();
        update.order.forEach((peer: any) => {
          var peerID = AppPeersManager.getPeerID(peer);
          newPinned[peerID] = true;

          var foundDialog = this.getDialogByPeerID(peerID);

          if(!foundDialog.length) {
            this.newDialogsToHandle[peerID] = {reload: true}
            if(!this.newDialogsHandlePromise) {
              this.newDialogsHandlePromise = window.setTimeout(this.handleNewDialogs.bind(this), 0);
            }
            return;
          }

          var dialog = foundDialog[0]
          dialog.index = this.generateDialogIndex(this.generateDialogPinnedDate());
          dialog.pFlags.pinned = true;

          this.newDialogsToHandle[peerID] = dialog
          if(!this.newDialogsHandlePromise) {
            this.newDialogsHandlePromise = window.setTimeout(this.handleNewDialogs.bind(this), 0);
          }
        })
        
        this.dialogsStorage.dialogs.forEach((dialog: any) => {
          var peerID = dialog.peerID;
          if(dialog.pFlags.pinned && !newPinned[peerID]) {
            this.newDialogsToHandle[peerID] = {reload: true}
            if(!this.newDialogsHandlePromise) {
              this.newDialogsHandlePromise = window.setTimeout(this.handleNewDialogs.bind(this), 0);
            }
          }
        })
        break;
      }   

      case 'updateEditMessage':
      case 'updateEditChannelMessage': {
        var message = update.message;
        var peerID = this.getMessagePeer(message);
        var channelID = message.to_id._ == 'peerChannel' ? -peerID : 0;
        var mid = appMessagesIDsManager.getFullMessageID(message.id, channelID);
        if(this.messagesStorage[mid] === undefined) {
          break;
        }

        // console.trace(dT(), 'edit message', message)
        this.saveMessages([message], {isEdited: true});
        safeReplaceObject(this.messagesStorage[mid], message);

        var wasForHistory = this.messagesForHistory[mid];
        if(wasForHistory !== undefined) {
          delete this.messagesForHistory[mid];
          var newForHistory = this.wrapForHistory(mid);
          safeReplaceObject(wasForHistory, newForHistory);
          this.messagesForHistory[mid] = wasForHistory;
        }

        var dialog = this.getDialogByPeerID(peerID)[0];
        var isTopMessage = dialog && dialog.top_message == mid;
        if(message.clear_history) {
          if(isTopMessage) {
            $rootScope.$broadcast('dialog_flush', {peerID: peerID});
          } else {
            var msgs: any = {};
            msgs[mid] = true;
            $rootScope.$broadcast('history_delete', {peerID: peerID, msgs: msgs});
          }
        } else {
          $rootScope.$broadcast('message_edit', {
            peerID: peerID,
            id: message.id,
            mid: mid
          });

          if(isTopMessage) {
            var updatedDialogs: any = {};
            updatedDialogs[peerID] = dialog;
            $rootScope.$broadcast('dialogs_multiupdate', updatedDialogs);
          }
        }
        break;
      }

      case 'updateReadHistoryInbox':
      case 'updateReadHistoryOutbox':
      case 'updateReadChannelInbox':
      case 'updateReadChannelOutbox': {
        var isOut = update._ == 'updateReadHistoryOutbox' || update._ == 'updateReadChannelOutbox';
        var channelID: number = update.channel_id;
        var maxID = appMessagesIDsManager.getFullMessageID(update.max_id, channelID);
        var peerID = channelID ? -channelID : AppPeersManager.getPeerID(update.peer);
        var foundDialog = this.getDialogByPeerID(peerID);
        var history = (this.historiesStorage[peerID] || {}).history || [];
        var newUnreadCount = 0;
        var length = history.length;
        var foundAffected = false;
        var messageID: number, message;
        var i;

        //console.warn(dT(), 'read', peerID, isOut ? 'out' : 'in', maxID)

        if(peerID > 0 && isOut) {
          appUsersManager.forceUserOnline(peerID);
        }

        for(i = 0; i < length; i++) {
          messageID = history[i];
          if(messageID > maxID) {
            continue;
          }
          message = this.messagesStorage[messageID];

          if(message.pFlags.out != isOut) {
            continue;
          }
          if(!message.pFlags.unread) {
            break;
          }
          // console.warn('read', messageID, message.pFlags.unread, message)
          if(message && message.pFlags.unread) {
            message.pFlags.unread = false
            if(this.messagesForHistory[messageID]) {
              this.messagesForHistory[messageID].pFlags.unread = false;
              if(!foundAffected) {
                foundAffected = true;
              }
            }
            if(this.messagesForDialogs[messageID]) {
              this.messagesForDialogs[messageID].pFlags.unread = false;
            }
            if(!message.pFlags.out) {
              if(foundDialog[0]) {
                newUnreadCount = --foundDialog[0].unread_count;
              }
              //NotificationsManager.cancel('msg' + messageID); // warning
            }
          }
        }
        if(foundDialog[0]) {
          if(!isOut && newUnreadCount && foundDialog[0].top_message <= maxID) {
            newUnreadCount = foundDialog[0].unread_count = 0;
          }

          let dialogKey = isOut ? 'read_outbox_max_id' : 'read_inbox_max_id';
          foundDialog[0][dialogKey] = maxID;
        }

        // need be commented for read out messages
        //if(newUnreadCount != 0 || !isOut) { // fix 16.11.2019 (maybe not)
          console.warn(dT(), 'cnt', peerID, newUnreadCount);
          $rootScope.$broadcast('dialog_unread', {peerID: peerID, count: newUnreadCount});
        //}

        if(foundAffected) {
          $rootScope.$broadcast('messages_read');
        }
        break;
      }

      case 'updateChannelReadMessagesContents': {
        var channelID: number = update.channel_id;
        var newMessages: any[] = [];
        update.messages.forEach((msgID: number) => {
          newMessages.push(appMessagesIDsManager.getFullMessageID(msgID, channelID));
        });
        update.messages = newMessages;
      }

      case 'updateReadMessagesContents': {
        var messages: any[] = update.messages;
        var len = messages.length;
        var i;
        var messageID: number, message;
        var historyMessage;
        for(i = 0; i < len; i++) {
          messageID = messages[i];
          if(message = this.messagesStorage[messageID]) {
            delete message.pFlags.media_unread;
          }
          if(historyMessage = this.messagesForHistory[messageID]) {
            delete historyMessage.pFlags.media_unread;
          }
        }
        break;
      }

      case 'updateChannelAvailableMessages': {
        var channelID: number = update.channel_id;
        var messages: any[] = [];
        var peerID: number = -channelID;
        var history = (this.historiesStorage[peerID] || {}).history || [];
        if(history.length) {
          history.forEach((msgID: number) => {
            if(!update.available_min_id ||
                appMessagesIDsManager.getMessageLocalID(msgID) <= update.available_min_id) {
              messages.push(msgID);
            }
          });
        }
        update.messages = messages;
      }

      case 'updateDeleteMessages':
      case 'updateDeleteChannelMessages': {
        var historiesUpdated: any = {};
        var channelID: number = update.channel_id;
        var messageID: number;
        var message, i;
        var peerID: number, foundDialog: any[];
        let history: any;
        var peerMessagesToHandle;
        var peerMessagesHandlePos;

        for (i = 0; i < update.messages.length; i++) {
          messageID = appMessagesIDsManager.getFullMessageID(update.messages[i], channelID);
          message = this.messagesStorage[messageID];
          if(message) {
            peerID = this.getMessagePeer(message);
            history = historiesUpdated[peerID] || (historiesUpdated[peerID] = {count: 0, unread: 0, msgs: {}});

            if(!message.pFlags.out && message.pFlags.unread) {
              history.unread++;
              // NotificationsManager.cancel('msg' + messageID); // warning
            }
            history.count++;
            history.msgs[messageID] = true;

            if(this.messagesForHistory[messageID]) {
              this.messagesForHistory[messageID].deleted = true;
              delete this.messagesForHistory[messageID];
            }
            if(this.messagesForDialogs[messageID]) {
              this.messagesForDialogs[messageID].deleted = true;
              delete this.messagesForDialogs[messageID];
            }
            message.deleted = true
            this.messagesStorage[messageID] = {
              deleted: true,
              id: messageID,
              from_id: message.from_id,
              to_id: message.to_id,
              flags: message.flags,
              pFlags: message.pFlags,
              date: message.date
            };

            peerMessagesToHandle = this.newMessagesToHandle[peerID];
            if(peerMessagesToHandle && peerMessagesToHandle.length) {
              peerMessagesHandlePos = peerMessagesToHandle.indexOf(messageID);
              if(peerMessagesHandlePos != -1) {
                peerMessagesToHandle.splice(peerMessagesHandlePos);
              }
            }
          }
        }

        Object.keys(historiesUpdated).forEach((peerID: string) => {
          let updatedData = historiesUpdated[peerID];
          var historyStorage = this.historiesStorage[peerID];
          if(historyStorage !== undefined) {
            var newHistory = []
            var newPending = []
            for(var i = 0; i < historyStorage.history.length; i++) {
              if(!updatedData.msgs[historyStorage.history[i]]) {
                newHistory.push(historyStorage.history[i]);
              }
            }
            historyStorage.history = newHistory;
            if(updatedData.count &&
              historyStorage.count !== null &&
              historyStorage.count > 0) {
              historyStorage.count -= updatedData.count
              if(historyStorage.count < 0) {
                historyStorage.count = 0;
              }
            }

            for(var i = 0; i < historyStorage.pending.length; i++) {
              if(!updatedData.msgs[historyStorage.pending[i]]) {
                newPending.push(historyStorage.pending[i]);
              }
            }
            historyStorage.pending = newPending;

            $rootScope.$broadcast('history_delete', {peerID: peerID, msgs: updatedData.msgs});
          }

          var foundDialog = this.getDialogByPeerID(+peerID)[0];
          if(foundDialog) {
            if(updatedData.unread) {
              foundDialog.unread_count -= updatedData.unread;

              $rootScope.$broadcast('dialog_unread', {
                peerID: peerID,
                count: foundDialog.unread_count
              });
            }

            if(updatedData.msgs[foundDialog.top_message]) {
              this.reloadConversation(+peerID);
            }
          }
        })
        break;
      }

      case 'updateChannel': {
        var channelID: number = update.channel_id;
        var peerID = -channelID;
        var channel = appChatsManager.getChat(channelID);

        var needDialog = channel._ == 'channel' && (!channel.pFlags.left && !channel.pFlags.kicked);
        var foundDialog = this.getDialogByPeerID(peerID);
        var hasDialog = foundDialog.length > 0;

        var canViewHistory = channel._ == 'channel' && (channel.username || !channel.pFlags.left && !channel.pFlags.kicked) && true || false;
        var hasHistory = this.historiesStorage[peerID] !== undefined;

        if(canViewHistory != hasHistory) {
          delete this.historiesStorage[peerID];
          $rootScope.$broadcast('history_forbidden', peerID);
        }
        if(hasDialog != needDialog) {
          if(needDialog) {
            this.reloadConversation(-channelID);
          } else {
            if(foundDialog[0]) {
              this.dialogsStorage.dialogs.splice(foundDialog[1], 1);
              $rootScope.$broadcast('dialog_drop', {peerID: peerID});
            }
          }
        }
        break;
      }

      case 'updateChannelReload': {
        var channelID: number = update.channel_id;
        var peerID = -channelID;
        var foundDialog = this.getDialogByPeerID(peerID);
        if(foundDialog[0]) {
          this.dialogsStorage.dialogs.splice(foundDialog[1], 1);
        }
        delete this.historiesStorage[peerID];
        this.reloadConversation(-channelID).then(() => {
          $rootScope.$broadcast('history_reload', peerID);
        });
        break;
      }

      case 'updateChannelMessageViews': {
        var views = update.views;
        var mid = appMessagesIDsManager.getFullMessageID(update.id, update.channel_id);
        var message = this.getMessage(mid);
        if(message && message.views && message.views < views) {
          message.views = views;
          $rootScope.$broadcast('message_views', {
            mid: mid,
            views: views
          });
        }
        break;
      }
        
      case 'updateServiceNotification': {
        // update.inbox_date = tsNow(true)
        // update.pFlags = {popup: true}
        var fromID = 777000;
        var peerID = fromID;
        var messageID = this.tempID--;
        var message: any = {
          _: 'message',
          id: messageID,
          from_id: fromID,
          to_id: AppPeersManager.getOutputPeer(peerID),
          flags: 0,
          pFlags: {unread: true},
          date: (update.inbox_date || tsNow(true)) + MTProto.serverTimeManager.serverTimeOffset,
          message: update.message,
          media: update.media,
          entities: update.entities
        };
        if(!appUsersManager.hasUser(fromID)) {
          appUsersManager.saveApiUsers([{
            _: 'user',
            id: fromID,
            pFlags: {verified: true},
            access_hash: 0,
            first_name: 'Telegram',
            phone: '42777'
          }]);
        }
        this.saveMessages([message]);

        if(update.inbox_date) {
          this.pendingTopMsgs[peerID] = messageID;
          this.handleUpdate({
            _: 'updateNewMessage',
            message: message
          });
        }
        if(update.pFlags.popup && update.message) {
          var historyMessage = this.wrapForHistory(messageID);
          //ErrorService.show({error: {code: 400, type: 'UPDATE_SERVICE_NOTIFICATION'}, historyMessage: historyMessage}); // warning
        }
        break;
      }
    }
  }

  public wrapForHistory(msgID: number) {
    if(this.messagesForHistory[msgID] !== undefined) {
      return this.messagesForHistory[msgID];
    }

    var message = copy(this.messagesStorage[msgID]) || {id: msgID};

    if(message.media && message.media.progress !== undefined) {
      message.media.progress = this.messagesStorage[msgID].media.progress;
    }

    var fromUser = message.from_id && appUsersManager.getUser(message.from_id);
    var fromBot = fromUser && fromUser.pFlags.bot && fromUser.username || false;
    var withBot = (fromBot ||
      message.to_id && (
      message.to_id.chat_id ||
      message.to_id.user_id && appUsersManager.isBot(message.to_id.user_id)
    )
    )

    if(message.media) {
      if(message.media.caption &&
        message.media.caption.length) {
        message.media.rCaption = RichTextProcessor.wrapRichText(message.media.caption, {
          noCommands: !withBot,
          fromBot: fromBot
        })
      }

      switch (message.media._) {
        case 'messageMediaPhoto':
          message.media.photo = appPhotosManager.wrapForHistory(message.media.photo.id)
          break

        /* case 'messageMediaDocument':
          message.media.document = appDocsManager.wrapForHistory(message.media.document.id)
          break */

        case 'messageMediaGeo':
          var mapUrl = 'https://maps.google.com/?q=' + message.media.geo['lat'] + ',' + message.media.geo['long']
          message.media.mapUrl = mapUrl;//$sce.trustAsResourceUrl(mapUrl) // warning
          break

        case 'messageMediaVenue':
          var mapUrl: string;
          if(message.media.provider == 'foursquare' &&
            message.media.venue_id) {
            mapUrl = 'https://foursquare.com/v/' + encodeURIComponent(message.media.venue_id)
          } else {
            mapUrl = 'https://maps.google.com/?q=' + message.media.geo['lat'] + ',' + message.media.geo['long']
          }
          message.media.mapUrl = mapUrl;//$sce.trustAsResourceUrl(mapUrl) // warning
          break

        case 'messageMediaContact':
          message.media.rFullName = RichTextProcessor.wrapRichText(
            message.media.first_name + ' ' + (message.media.last_name || ''),
            {noLinks: true, noLinebreaks: true}
          )
          break

        /* case 'messageMediaWebPage':
          if(!message.media.webpage ||
            message.media.webpage._ == 'webPageEmpty') {
            delete message.media
            break
          }
          message.media.webpage = AppWebPagesManager.wrapForHistory(message.media.webpage.id)
          break

        case 'messageMediaGame':
          message.media.game = AppGamesManager.wrapForHistory(message.media.game.id)
          break */
      }
    } else if(message.action) {
      switch (message.action._) {
        case 'messageActionChatEditPhoto':
        case 'messageActionChannelEditPhoto':
          message.action.photo = appPhotosManager.wrapForHistory(message.action.photo.id);
          break

        case 'messageActionChatCreate':
        case 'messageActionChatEditTitle':
        case 'messageActionChannelCreate':
        case 'messageActionChannelEditTitle':
          message.action.rTitle = RichTextProcessor.wrapRichText(message.action.title, {noLinebreaks: true}) || 'chat_title_deleted';
          break

        case 'messageActionBotIntro':
          message.action.rDescription = RichTextProcessor.wrapRichText(message.action.description, {
            noCommands: !withBot,
            fromBot: fromBot
          });
          break;
      }
    }

    return this.messagesForHistory[msgID] = message;
  }

  public finalizePendingMessage(randomID: number, finalMessage: any) {
    var pendingData = this.pendingByRandomID[randomID];
    // console.log('pdata', randomID, pendingData)

    if(pendingData) {
      var peerID = pendingData[0];
      var tempID = pendingData[1];
      var historyStorage = this.historiesStorage[peerID],
        message,
        historyMessage;

      // console.log('pending', randomID, historyStorage.pending)
      var pos = historyStorage.pending.indexOf(tempID);
      if(pos != -1) {
        historyStorage.pending.splice(pos, 1);
      }

      if(message = this.messagesStorage[tempID]) {
        delete message.pending;
        delete message.error;
        delete message.random_id;
        delete message.send;
      }

      if(historyMessage = this.messagesForHistory[tempID]) {
        this.messagesForHistory[finalMessage.mid] = Object.assign(historyMessage, this.wrapForHistory(finalMessage.mid));
        delete historyMessage.pending;
        delete historyMessage.error;
        delete historyMessage.random_id;
        delete historyMessage.send;

        $rootScope.$broadcast('messages_pending');
      }

      delete this.messagesForHistory[tempID];
      delete this.messagesStorage[tempID];

      this.finalizePendingMessageCallbacks(tempID, finalMessage.mid);

      return message;
    }

    return false
  }

  public finalizePendingMessageCallbacks(tempID: number, mid: number) {
    $rootScope.$broadcast('message_sent', {tempID, mid});
  }

  public incrementMaxSeenID(maxID: number) {
    if(!maxID || !(!this.maxSeenID || maxID > this.maxSeenID)) {
      return false;
    }

    AppStorage.set({
      max_seen_msg: maxID
    });

    MTProto.apiManager.invokeApi('messages.receivedMessages', {
      max_id: maxID
    });
  }

  public getHistory(peerID: number, maxID = 0, limit = 0, backLimit?: number, prerendered?: number) {
    if(this.migratedFromTo[peerID]) {
      peerID = this.migratedFromTo[peerID];
    }
    var historyStorage = this.historiesStorage[peerID];
    var offset = 0;
    var offsetNotFound = false;
    var unreadOffset = 0;
    var unreadSkip = false;

    prerendered = prerendered ? Math.min(50, prerendered) : 0;

    if(historyStorage === undefined) {
      historyStorage = this.historiesStorage[peerID] = {count: null, history: [], pending: []};
    }

    if(maxID < 0) {
      maxID = 0;
    }
    var isMigrated = false;
    var reqPeerID = peerID;
    if(this.migratedToFrom[peerID]) {
      isMigrated = true;
      if(maxID && maxID < appMessagesIDsManager.fullMsgIDModulus) {
        reqPeerID = this.migratedToFrom[peerID];
      }
    }

    if(!limit && !maxID) {
      var foundDialog = this.getDialogByPeerID(peerID)[0];
      if(foundDialog && foundDialog.unread_count > 1) {
        var unreadCount = foundDialog.unread_count;
        if(unreadSkip = (unreadCount > 50)) {
          if(foundDialog.read_inbox_max_id) {
            maxID = foundDialog.read_inbox_max_id;
            backLimit = 16;
            unreadOffset = 16;
            limit = 4;
          } else {
            limit = 20;
            unreadOffset = 16;
            offset = unreadCount - unreadOffset;
          }
        } else {
          limit = Math.max(10, prerendered, unreadCount + 2);
          unreadOffset = unreadCount;
        }
      } else if('Mobile' in Config) {
        limit = 20;
      }
    }

    if(maxID > 0) {
      offsetNotFound = true;
      for(offset = 0; offset < historyStorage.history.length; offset++) {
        if(maxID > historyStorage.history[offset]) {
          offsetNotFound = false;
          break;
        }
      }
    }

    if(!offsetNotFound && (
      historyStorage.count !== null && historyStorage.history.length == historyStorage.count ||
      historyStorage.history.length >= offset + (limit || 1)
      )) {
      if(backLimit) {
        backLimit = Math.min(offset, backLimit);
        offset = Math.max(0, offset - backLimit);
        limit += backLimit;
      } else {
        limit = limit || (offset ? 20 : (prerendered || 5));
      }
      var history = historyStorage.history.slice(offset, offset + limit);
      if(!maxID && historyStorage.pending.length) {
        history = historyStorage.pending.slice().concat(history);
      }
      return this.wrapHistoryResult(peerID, {
        count: historyStorage.count,
        history: history,
        unreadOffset: unreadOffset,
        unreadSkip: unreadSkip
      });
    }

    if(!backLimit && !limit) {
      limit = prerendered || 20;
    }
    if(offsetNotFound) {
      offset = 0;
    }
    if((backLimit || unreadSkip || maxID) && historyStorage.history.indexOf(maxID) == -1) {
      if(backLimit) {
        offset = -backLimit;
        limit += backLimit;
      }

      return this.requestHistory(reqPeerID, maxID, limit, offset).then((historyResult: any) => {
        historyStorage.count = historyResult.count || historyResult.messages.length;
        if(isMigrated) {
          historyStorage.count++;
        }

        var history: number[] = [];
        historyResult.messages.forEach((message: any) => {
          history.push(message.mid);
        })

        if(!maxID && historyStorage.pending.length) {
          history = historyStorage.pending.slice().concat(history);
        }

        return this.wrapHistoryResult(peerID, {
          count: historyStorage.count,
          history: history,
          unreadOffset: unreadOffset,
          unreadSkip: unreadSkip
        });
      });
    }

    return this.fillHistoryStorage(peerID, maxID, limit, historyStorage).then(() => {
      offset = 0;
      if(maxID > 0) {
        for(offset = 0; offset < historyStorage.history.length; offset++) {
          if(maxID > historyStorage.history[offset]) {
            break;
          }
        }
      }

      var history = historyStorage.history.slice(offset, offset + limit);
      if(!maxID && historyStorage.pending.length) {
        history = historyStorage.pending.slice().concat(history);
      }

      return this.wrapHistoryResult(peerID, {
        count: historyStorage.count,
        history: history,
        unreadOffset: unreadOffset,
        unreadSkip: unreadSkip
      });
    });
  }

  public fillHistoryStorage(peerID: number, maxID: number, fullLimit: number, historyStorage: HistoryStorage): Promise<boolean> {
    // console.log('fill history storage', peerID, maxID, fullLimit, angular.copy(historyStorage))
    var offset = (this.migratedFromTo[peerID] && !maxID) ? 1 : 0;
    return this.requestHistory(peerID, maxID, fullLimit, offset).then((historyResult: any) => {
      historyStorage.count = historyResult.count || historyResult.messages.length;

      var offset = 0;
      if(!maxID && historyResult.messages.length) {
        maxID = historyResult.messages[0].mid + 1;
      }
      if(maxID > 0) {
        for(offset = 0; offset < historyStorage.history.length; offset++) {
          if(maxID > historyStorage.history[offset]) {
            break;
          }
        }
      }

      var wasTotalCount = historyStorage.history.length;

      historyStorage.history.splice(offset, historyStorage.history.length - offset)
      historyResult.messages.forEach((message: any) => {
        if(this.mergeReplyKeyboard(historyStorage, message)) {
          $rootScope.$broadcast('history_reply_markup', {peerID: peerID});
        }

        historyStorage.history.push(message.mid);
      });

      var totalCount = historyStorage.history.length;
      fullLimit -= (totalCount - wasTotalCount);

      var migratedNextPeer = this.migratedFromTo[peerID];
      var migratedPrevPeer = this.migratedToFrom[peerID]
      var isMigrated = migratedNextPeer !== undefined || migratedPrevPeer !== undefined;

      if(isMigrated) {
        historyStorage.count = Math.max(historyStorage.count, totalCount) + 1;
      }

      if(fullLimit > 0) {
        maxID = historyStorage.history[totalCount - 1];
        if(isMigrated) {
          if(!historyResult.messages.length) {
            if(migratedPrevPeer) {
              maxID = 0;
              peerID = migratedPrevPeer;
            } else {
              historyStorage.count = totalCount;
              return true;
            }
          }

          return this.fillHistoryStorage(peerID, maxID, fullLimit, historyStorage);
        } else if(totalCount < historyStorage.count) {
          return this.fillHistoryStorage(peerID, maxID, fullLimit, historyStorage);
        }
      }

      return true;
    });
  }

  public wrapHistoryResult(peerID: number, result: any) {
    var unreadOffset = result.unreadOffset;
    if(unreadOffset) {
      var i;
      var message;
      for(i = result.history.length - 1; i >= 0; i--) {
        message = this.messagesStorage[result.history[i]];
        if(message && !message.pFlags.out && message.pFlags.unread) {
          result.unreadOffset = i + 1;
          break;
        }
      }
    }
    return Promise.resolve(result);
  }

  public requestHistory(peerID: number, maxID: number, limit: number, offset = 0) {
    var isChannel = AppPeersManager.isChannel(peerID);

    console.trace('requestHistory', peerID, maxID, limit, offset);

    return MTProto.apiManager.invokeApi('messages.getHistory', {
      peer: AppPeersManager.getInputPeerByID(peerID),
      offset_id: maxID ? appMessagesIDsManager.getMessageLocalID(maxID) : 0,
      offset_date: 0,
      add_offset: offset || 0,
      limit: limit || 0,
      max_id: 0,
      min_id: 0,
      hash: 0
    }/* {
      peer: AppPeersManager.getInputPeerByID(peerID),
      offset_id: offset,
      offset_date: 0,
      add_offset: offset || 0,
      limit: limit || 0,
      max_id: maxID,
      min_id: 0,
      hash: 0
    } */, {
      timeout: 300,
      noErrorBox: true
    }).then((historyResult: any) => {
      appUsersManager.saveApiUsers(historyResult.users);
      appChatsManager.saveApiChats(historyResult.chats);
      this.saveMessages(historyResult.messages);

      if(isChannel) {
        apiUpdatesManager.addChannelState(-peerID, historyResult.pts);
      }

      var length = historyResult.messages.length;
      if(length &&
        historyResult.messages[length - 1].deleted) {
        historyResult.messages.splice(length - 1, 1);
        length--;
        historyResult.count--;
      }

      if(
        peerID < 0 ||
        !appUsersManager.isBot(peerID) ||
        (length == limit && limit < historyResult.count)
      ) {
        return historyResult;
      }

      return appProfileManager.getProfile(peerID).then((userFull: any) => {
        var description = userFull.bot_info && userFull.bot_info.description;
        if(description) {
          var messageID = this.tempID--;
          var message = {
            _: 'messageService',
            id: messageID,
            from_id: peerID,
            to_id: AppPeersManager.getOutputPeer(peerID),
            flags: 0,
            pFlags: {},
            date: tsNow(true) + MTProto.serverTimeManager.serverTimeOffset,
            action: {
              _: 'messageActionBotIntro',
              description: description
            }
          }

          this.saveMessages([message]);
          historyResult.messages.push(message);
          if(historyResult.count) {
            historyResult.count++;
          }
        }

        return historyResult;
      });
    }, (error) => {
      switch (error.type) {
        case 'CHANNEL_PRIVATE':
          var channel = appChatsManager.getChat(-peerID);
          channel = {_: 'channelForbidden', access_hash: channel.access_hash, title: channel.title};
          apiUpdatesManager.processUpdateMessage({
            _: 'updates',
            updates: [{
              _: 'updateChannel',
              channel_id: -peerID
            }],
            chats: [channel],
            users: []
          });
          break;
      }

      return Promise.reject(error);
    });
  }

  public wrapForDialog(msgID: number, dialog?: any) {
    var useCache = msgID && dialog !== undefined;
    var unreadCount = dialog && dialog.unread_count;

    if(useCache && this.messagesForDialogs[msgID] !== undefined) {
      delete this.messagesForDialogs[msgID].typing;
      this.messagesForDialogs[msgID].unreadCount = unreadCount;
      return this.messagesForDialogs[msgID];
    }

    var message = copy(this.messagesStorage[msgID]);

    if(!message || !message.to_id) {
      if(dialog && dialog.peerID) {
        message = {
          _: 'message',
          to_id: AppPeersManager.getOutputPeer(dialog.peerID),
          deleted: true,
          date: tsNow(true),
          pFlags: {out: true}
        }
      } else {
        return message;
      }
    }

    message.peerID = this.getMessagePeer(message);
    message.peerData = AppPeersManager.getPeer(message.peerID);
    message.peerString = AppPeersManager.getPeerString(message.peerID);
    message.unreadCount = unreadCount;
    message.index = dialog && dialog.index || (message.date * 0x10000);
    message.pinned = dialog && dialog.pFlags.pinned || false;

    if(message._ == 'messageService' && message.action.user_id) {
      message.action.user = appUsersManager.getUser(message.action.user_id);
    }

    if(message.message && message.message.length) {
      message.richMessage = RichTextProcessor.wrapRichText(message.message.substr(0, 128), {noLinks: true, noLinebreaks: true});
    }

    message.dateText = message.date; //dateOrTimeFilter(message.date); // warning

    if(useCache) {
      message.draft = '';//DraftsManager.getServerDraft(message.peerID); // warning
      this.messagesForDialogs[msgID] = message;
    }

    return message;
  }

  public fetchSingleMessages() {
    if(this.fetchSingleMessagesPromise) {
      return this.fetchSingleMessagesPromise;
    }

    var mids = this.needSingleMessages.slice();
    this.needSingleMessages = [];

    var splitted = appMessagesIDsManager.splitMessageIDsByChannels(mids);
    let promises: Promise<void>[] = [];
    Object.keys(splitted.msgIDs).forEach((channelID: number | string) => {
      let msgIDs = splitted.msgIDs[channelID].map((mid: number) => {
        return {
          _: 'inputMessageID',
          id: mid
        };
      });

      var promise;
      channelID = +channelID;
      if(channelID > 0) {
        promise = MTProto.apiManager.invokeApi('channels.getMessages', {
          channel: appChatsManager.getChannelInput(channelID),
          id: msgIDs
        });
      } else {
        promise = MTProto.apiManager.invokeApi('messages.getMessages', {
          id: msgIDs
        });
      }

      promises.push(promise.then((getMessagesResult: any) => {
        appUsersManager.saveApiUsers(getMessagesResult.users);
        appChatsManager.saveApiChats(getMessagesResult.chats);
        this.saveMessages(getMessagesResult.messages);

        $rootScope.$broadcast('messages_downloaded', splitted.mids[channelID])
      }));
    });

    return this.fetchSingleMessagesPromise = Promise.all(promises).then(() => {
      this.fetchSingleMessagesPromise = null;
      if(this.needSingleMessages.length) this.fetchSingleMessages();
    }).catch(() => {
      this.fetchSingleMessagesPromise = null;
      if(this.needSingleMessages.length) this.fetchSingleMessages();
    });
  }

  /* public wrapSingleMessage(msgID: number) {
    if(this.messagesStorage[msgID]) {
      return this.wrapForDialog(msgID);
    }

    if(this.needSingleMessages.indexOf(msgID) == -1) {
      this.needSingleMessages.push(msgID);
      if(this.fetchSingleMessagesTimeout == 0) {
        this.fetchSingleMessagesTimeout = window.setTimeout(this.fetchSingleMessages.bind(this), 100);
      }
    }

    return {mid: msgID, loading: true};
  } */
  public wrapSingleMessage(msgID: number) {
    if(this.messagesStorage[msgID]) {
      $rootScope.$broadcast('messages_downloaded', msgID);
      return;
    }

    if(this.needSingleMessages.indexOf(msgID) == -1) {
      this.needSingleMessages.push(msgID);
      this.fetchSingleMessages();
    }
  }
}

export default new AppMessagesManager();