class ReqTicket{
    constructor (depName,arrName,date)
    {
        this.depName = depName;
        this.arrName = arrName;
        this.date = date;
    }
    getDepName(){
        return this.depName;
    }
}
module.exports = {ReqTicket}