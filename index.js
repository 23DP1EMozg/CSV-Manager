const fs = require('fs')
const readline = require('readline');


class CsvManager{

    constructor(path){
        this.path = path
        this.properties = []
    }

    setProperties(list){
        this.properties = list
    }


    rewriteFile(list2d){
        
        let dataString = ""

        for(let i = 0; i<this.properties.length; i++){
            dataString += this.properties[i] + ','
        }
        dataString += '\n'

        for(let i = 0; i<list2d.length; i++){
            for(let j = 0; j<list2d[i].length; j++){
                dataString += list2d[i][j] + ','
            }
            dataString = dataString.slice(0, -1)
            dataString += '\n'
        }

        fs.writeFile(this.path, dataString, (err) => {
            if (err) throw err
            console.log('saved')
        })
    }

    addData(list){
        let dataString = ""

        if((!fs.existsSync(this.path) && this.properties.length > 0) || (fs.statSync(this.path).size == 0 && this.properties.length > 0)){
            console.log('heaaa')
            for(let i = 0; i<this.properties.length; i++){
                dataString += this.properties[i] + ','
            }
            dataString = dataString.slice(0, -1)
            dataString += '\n'
        }

        for(let i = 0; i<list.length; i++){
            dataString += list[i] + ','
        }
        dataString = dataString.slice(0, -1)
        dataString += '\n'
        
        fs.appendFile(this.path, dataString, (err) => {
            if (err) throw err
        })

    }

    getAllDataAsObjects(callback){

            const data = []
            const rl = readline.createInterface({
                input: fs.createReadStream(this.path),
                output: process.stdout,
                terminal: false,
            });
    
            
            let isFirstLine = true
            rl.on('line', (line) => {
                if(isFirstLine){
                    isFirstLine = false
                    return
                }else{
                    const obj = {}
                    const values = line.split(',')

                    for(let i = 0; i<this.properties.length; i++){
                        obj[this.properties[i]] = values[i]
                    }
                    data.push(obj)
                }
            })

            rl.on('close', () => callback(data))
            rl.on('error', (err) => callback(err))
            
    }

    getAllDataAsLists(callback){
            const data = []
            const rl = readline.createInterface({
                input: fs.createReadStream(this.path),
                output: process.stdout,
                terminal: false,
            });
    
            
            let isFirstLine = true
            rl.on('line', (line) => {
                if(isFirstLine){
                    isFirstLine = false
                    return
                }else{
                    data.push(line.split(','))
                }
            })

            rl.on('close', () => callback(data))
            rl.on('error', (err) => callback(err))
    }

    deleteOne(prop, value){
        this.getAllDataAsObjects(data => {
            for(let i = 0; i<data.length; i++){
                if(data[i][prop] === value){
                    this.getAllDataAsLists(res => {
                        res.splice(i, 1)
                        this.rewriteFile(res)
                    })                    
                    return
                }
            }
        })
    }

    deleteMany(prop, value){
        const indexes = []
        this.getAllDataAsObjects(data => {
            for(let i = 0; i<data.length; i++){
                if(data[i][prop] === value){
                    indexes.push(i)
                }
            }
        })

        this.getAllDataAsLists(res => {
            for(let i = indexes.length - 1; i >= 0; i--){
                const indexToRemove = indexes[i]
                res.splice(indexToRemove, 1)
            }
            this.rewriteFile(res)
        })
    }
}

const a = new CsvManager('data.csv')
//a.setProperties(['name', 'lastname', 'age'])
a.addData(['ciga', 'liga', '8'])
//a.deleteOne('name', 'baka')
//a.deleteMany('name', 'ciga')