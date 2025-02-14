
module.exports = (sequelize,datatypes) => {

    const Image = sequelize.define('image',{
        path:{
            type:datatypes.STRING,
            allowNull:false,
        },
        isPublic:{
            type:datatypes.BOOLEAN,

        },
        title:{
            type:datatypes.STRING,
            set(value){
                this.setDataValue('title',value.trim());
            }
        },
        description:{
            type:datatypes.STRING(1000),
            set(value){
                this.setDataValue('description',value.trim());
            }
        },
        tags:{
            
            type:datatypes.STRING(1000),
            defaultValue: '',
            get(){
                tags = this.getDataValue('tags').slice(1,-1);
                
                return tags;
            },
            set(value){
                value = value
                    .split(',')
                    .map(el=>{
                        el = el.trim();
                        return el;
                    })
                    .filter(el=>{
                        return el !== '';
                    }).join(',');
                value = ","+value + ",";
                this.setDataValue('tags',value)

            }
        },
        getTags:{
            type: datatypes.VIRTUAL,
            get() {
                let tags = this.tags.split(',');
                if(tags[0] == '')return [];
                return tags;
            },
        },
        humanizeCreatedAt:{
            type: datatypes.VIRTUAL,
            get() {
                if(this.createdAt== undefined){
                    return "undefined";
                }
                const past = this.createdAt.getTime();

               
                const current = (new Date()).getTime();

                let timeDiff = current - past;

                let daysAgo =Math.round(timeDiff / (1000 * 3600 * 24));

                if(daysAgo == 0)
                    return `latest upload`;
                return `${ daysAgo} day${daysAgo==1?'':'s'} ago`;
            },
        }
    },{

    })
    return Image;
};