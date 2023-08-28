import appUsersManager from "../../lib/appManagers/appUsersManager"

export class Scroll{
    messageArr:any[]
    count:number
    scrape_status:HTMLElement
    scrape_count:HTMLElement

    constructor(messageArr:[]){
        this.messageArr = messageArr
        this.count = 0
        this.scrape_status = document.querySelector('#scrape-status')
        this.scrape_count = document.querySelector('#scrape-count')
    }
    // * Primary method to perform the automatic scrolling and calls the other method to perform intended functions
    public scrollChannel(container:any){
        this.scrape_status.textContent = 'Running'
        let intervalId = setInterval(async () => {
            const stoppingPoint = document.querySelectorAll('.bubbles')[0]
            container.scrollTop = container.scrollHeight
            stoppingPoint.classList.forEach((val:any) => {
                if (val === 'scrolled-down')endFunction()
            })
            await this.net()
        }, 200)

        let endFunction = () =>{
            clearInterval(intervalId)
            this.net()
            this.appendToHtml(this.cleanData())
        }
    }
    // * grabs all the display names as the window is scrolling down 
    private net(){
        this.messageArr = []
        let arrayOfMessages = document.querySelectorAll('.bubble-content-wrapper > .bubble-content > .name')
        arrayOfMessages.forEach(msg => {
            this.messageArr.push(msg)
        })
    }
    // * cleans the information by removing unecessary characters and checking whether a user was forwarded from another group
    private cleanData(){
        let names = this.messageArr.map(x => {
            let names_filter = x.textContent.replace(/\n/g, ' ').replace('-', '').replace('.', '').replace(':','').replace('ID','')
            return names_filter.split(' ')
        })
        let filtered_names = names.filter(user => {
            if(!user.join(' ').includes('Forwarded from')){
                return user
            }
        })
        let name_map = filtered_names.reduce((accum:any, name:any) => {
            accum[name[name.length - 1]] = name.join(' ')
            return accum;            
          }, {});
        return name_map
    }
    // * Updates html with new information
    private appendToHtml(obj:any){
        this.count = 0
        const scrapeListEl = document.querySelector('#member-scrape') as HTMLElement
        scrapeListEl.innerHTML = ''
        const keys_of_array = Object.keys(obj)
        keys_of_array.forEach(id => {
            let split_data: string = obj[id];
            let displayName = '';
            let username = '';
            let userID = '';
    
            const usernameMatch = split_data.match(/@([^ ]+)/);
            if (usernameMatch) {
                username = `@${usernameMatch[1]}`;
                split_data = split_data.replace(usernameMatch[0], '');
            }
    
            const userIDMatch = split_data.match(/\d{6,10}/);
            if (userIDMatch) {
                userID = `( ${userIDMatch[0]} )`;
                split_data = split_data.replace(userIDMatch[0], '');
            }

            displayName = split_data.trim();
    
            const create_list_el = document.createElement('li');
            create_list_el.className = 'scraped-user';

            if (username) {
                create_list_el.textContent = `${displayName} ${username} ${userID}`;
            } else {
                create_list_el.textContent = `${displayName} ${userID}`;
            }
            scrapeListEl.appendChild(create_list_el);
    
            this.count += 1;
            this.scrape_status.textContent = 'Done';
        }); 
        this.scrape_count.textContent = `${this.count}`;
    }
}
export const scrollClass = new Scroll([])
