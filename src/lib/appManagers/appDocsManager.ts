import apiFileManager, { CancellablePromise } from '../mtproto/apiFileManager';
import {$rootScope} from '../utils';
import FileManager from '../filemanager';
import {RichTextProcessor} from '../richtextprocessor';
//import { MTDocument } from '../../components/misc';

class AppDocsManager {
  private docs: any = {};
  
  constructor() {
    
  }
  
  public saveDoc(apiDoc: /* MTDocument */any, context?: any) {
    this.docs[apiDoc.id] = apiDoc;
    
    if(context) {
      Object.assign(apiDoc, context);
    }
    
    if(apiDoc.thumb && apiDoc.thumb._ == 'photoCachedSize') {
      apiFileManager.saveSmallFile(apiDoc.thumb.location, apiDoc.thumb.bytes);
      
      // Memory
      apiDoc.thumb.size = apiDoc.thumb.bytes.length;
      delete apiDoc.thumb.bytes;
      apiDoc.thumb._ = 'photoSize';
    }
    
    if(apiDoc.thumb && apiDoc.thumb._ == 'photoSizeEmpty') {
      delete apiDoc.thumb;
    }
    
    apiDoc.attributes.forEach((attribute: any) => {
      switch(attribute._) {
        case 'documentAttributeFilename':
          apiDoc.file_name = attribute.file_name
          break;

        case 'documentAttributeAudio':
          apiDoc.duration = attribute.duration
          apiDoc.audioTitle = attribute.title
          apiDoc.audioPerformer = attribute.performer
          apiDoc.type = attribute.pFlags.voice ? 'voice' : 'audio'
          break;

        case 'documentAttributeVideo':
          apiDoc.duration = attribute.duration;
          apiDoc.w = attribute.w;
          apiDoc.h = attribute.h;
          if(apiDoc.thumbs && attribute.pFlags.round_message) {
            apiDoc.type = 'round';
          } else if(apiDoc.thumbs) {
            apiDoc.type = 'video';
          }
          break;

        case 'documentAttributeSticker':
          apiDoc.sticker = true;

          if(attribute.alt !== undefined) {
            apiDoc.stickerEmojiRaw = attribute.alt;
            apiDoc.stickerEmoji = RichTextProcessor.wrapRichText(apiDoc.stickerEmojiRaw, {noLinks: true, noLinebreaks: true});
          }

          if(attribute.stickerset) {
            if(attribute.stickerset._ == 'inputStickerSetEmpty') {
              delete attribute.stickerset
            } else if(attribute.stickerset._ == 'inputStickerSetID') {
              apiDoc.stickerSetInput = attribute.stickerset
            }
          }

          if(apiDoc.thumbs && apiDoc.mime_type == 'image/webp') {
            apiDoc.type = 'sticker'
          } else if(apiDoc.mime_type == 'application/x-tgsticker') {
            apiDoc.type = 'sticker';
            apiDoc.animated = true;
          }
          break;

        case 'documentAttributeImageSize':
          apiDoc.w = attribute.w;
          apiDoc.h = attribute.h;
          break;

        case 'documentAttributeAnimated':
          if((apiDoc.mime_type == 'image/gif' || apiDoc.mime_type == 'video/mp4') && apiDoc.thumbs) {
            apiDoc.type = 'gif';
          }

          apiDoc.animated = true;
          break;
      }
    });
    
    if(!apiDoc.mime_type) {
      switch(apiDoc.type) {
        case 'gif':
          apiDoc.mime_type = 'video/mp4';
          break;
        case 'video':
        case 'round':
          apiDoc.mime_type = 'video/mp4';
          break;
        case 'sticker':
          apiDoc.mime_type = 'image/webp'
          break
        case 'audio':
          apiDoc.mime_type = 'audio/mpeg'
          break
        case 'voice':
          apiDoc.mime_type = 'audio/ogg'
          break
        default:
          apiDoc.mime_type = 'application/octet-stream'
          break
      }
    }
    
    if(!apiDoc.file_name) {
      apiDoc.file_name = ''
    }
    
    if(apiDoc._ == 'documentEmpty') {
      apiDoc.size = 0;
    }
  }
  
  public getDoc(docID: string) {
    return this.docs[docID] || {_: 'documentEmpty'};
  }
  
  public hasDoc(docID: string) {
    return this.docs[docID] !== undefined;
  }
  
  public getFileName(doc: any) {
    if (doc.file_name) {
      return doc.file_name
    }
    var fileExt = '.' + doc.mime_type.split('/')[1]
    if (fileExt == '.octet-stream') {
      fileExt = ''
    }
    return 't_' + (doc.type || 'file') + doc.id + fileExt
  }
  
  public updateDocDownloaded(docID: string) {
    var doc = this.docs[docID];
    var inputFileLocation = {
      _: 'inputDocumentFileLocation',
      id: docID,
      access_hash: doc.access_hash,
      version: doc.version,
      file_name: this.getFileName(doc)
    };
    
    if(doc.downloaded === undefined) {
      apiFileManager.getDownloadedFile(inputFileLocation, doc.size).then(() => {
        doc.downloaded = true;
      }, () => {
        doc.downloaded = false;
      });
    }
  }
  
  public downloadDoc(docID: any, toFileEntry?: any): CancellablePromise<Blob> {
    let doc: any;
    if(typeof(docID) === 'string') {
      doc = this.docs[docID];
    } else {
      doc = docID;
    }

    var inputFileLocation = {
      _: 'inputDocumentFileLocation',
      id: doc.id,
      access_hash: doc.access_hash,
      file_reference: doc.file_reference,
      thumb_size: '',
      version: doc.version,
      file_name: this.getFileName(doc)
    };
    
    if(doc._ == 'documentEmpty') {
      return Promise.reject();
    }
    
    if(doc.downloaded && !toFileEntry) {
      var cachedBlob = apiFileManager.getCachedFile(inputFileLocation);
      if(cachedBlob) {
        return Promise.resolve(cachedBlob);
      }
    }
    
    //historyDoc.progress = {enabled: !historyDoc.downloaded, percent: 1, total: doc.size};
    
    // нет смысла делать объект с выполняющимися промисами, нижняя строка и так вернёт загружающийся
    var downloadPromise: CancellablePromise<Blob> = apiFileManager.downloadFile(doc.dc_id, inputFileLocation, doc.size, {
      mimeType: doc.mime_type || 'application/octet-stream',
      toFileEntry: toFileEntry
    });
    
    downloadPromise.then((blob) => {
      if(blob) {
        doc.downloaded = true;

        /* FileManager.getFileCorrectUrl(blob, doc.mime_type).then((url) => {
          doc.url = url;
        }); */
      }

      /* doc.progress.percent = 100;
      setTimeout(() => {
        delete doc.progress;
      }, 0); */
      // console.log('file save done')

      return blob;
    }, (e) => {
      console.log('document download failed', e);
      //historyDoc.progress.enabled = false;
    });
    
    /* downloadPromise.notify = (progress) => {
      console.log('dl progress', progress);
      historyDoc.progress.enabled = true;
      historyDoc.progress.done = progress.done;
      historyDoc.progress.percent = Math.max(1, Math.floor(100 * progress.done / progress.total));
      $rootScope.$broadcast('history_update');
    }; */
    
    //historyDoc.progress.cancel = downloadPromise.cancel;
    
    return downloadPromise;
  }
  
  /* public saveDocFile(docID: string) {
    var doc = this.docs[docID]
    var historyDoc = this.docsForHistory[docID] || doc || {}
    var mimeType = doc.mime_type
    var fileName = this.getFileName(doc)
    var ext = (fileName.split('.', 2) || [])[1] || ''
    
    FileManager.chooseSave(this.getFileName(doc), ext, doc.mime_type).then((writableFileEntry) => {
      if (writableFileEntry) {
        this.downloadDoc(docID, writableFileEntry)
      }
    }, () => {
      this.downloadDoc(docID).then((blob) => {
        FileManager.download(blob, doc.mime_type, fileName)
      })
    })
  } */
}

export default new AppDocsManager();