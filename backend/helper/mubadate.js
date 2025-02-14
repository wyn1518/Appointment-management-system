
function compareByYear(date1,date2){
    return parseInt(date1.getFullYear()) - parseInt(date2.getFullYear()); 
}
function compareByYearMonth(date1,date2){
    let y1  = parseInt(date1.getFullYear()) 
    let y2 = parseInt(date2.getFullYear());
    
    if(y1 !== y2){
        return y1-y2;
    }
    let m1 = parseInt(date1.getMonth());
    let m2 = parseInt(date2.getMonth());

    return m1-m2;
}
function compareByYearMonthDay(date1,date2){
    let y1  = parseInt(date1.getFullYear()) 
    let y2 = parseInt(date2.getFullYear());
    if(y1 !== y2) return y1-y2;
    
    let m1 = parseInt(date1.getMonth());
    let m2 = parseInt(date2.getMonth());
    if(m1 !== m2) return m1-m2;

    let d1 = parseInt(date1.getDate());
    let d2 = parseInt(date2.getDate());
    return d1-d2;
}
function minByMonthAndYear(d1,d2){
    let y1 = parseInt(d1.getFullYear())
    let y2 = parseInt(d2.getFullYear())
    
    if(y1 < y2){
        return new Date(d1)
    }
    if(y1 > y2){
        return new Date(d2)
    }

    let m1 = parseInt(d1.getMonth())
    let m2 = parseInt(d2.getMonth())
    
    if(m1 < m2){
        return new Date(d1)
    }
    if(m1 > m2){
        return new Date(d2)
    }

    // let d1 = parseInt(d1.getDate())
    // let d2 = parseInt(d2.getDate())
    
    // if(d1 < d2){
    //     return new Date(d1)
    // }
    // if(d1 > d2){
    //     return new Date(d2)
    // }

    return d1;

}
function maxByMonthAndYear(d1,d2){
    let y1 = parseInt(d1.getFullYear())
    let y2 = parseInt(d2.getFullYear())
    
    if(y1 < y2){
        return new Date(d2)
    }
    if(y1 > y2){
        return new Date(d1)
    }

    let m1 = parseInt(d1.getMonth())
    let m2 = parseInt(d2.getMonth())
    
    if(m1 < m2){
        return new Date(d2)
    }
    if(m1 > m2){
        return new Date(d1)
    }

    // let d1 = parseInt(d1.getDate())
    // let d2 = parseInt(d2.getDate())
    
    // if(d1 < d2){
    //     return new Date(d2)
    // }
    // if(d1 > d2){
    //     return new Date(d1)
    // }

    return d1;

}
module.exports = {
    compareByYear,
    compareByYearMonth,
    minByMonthAndYear,
    maxByMonthAndYear,
    compareByYearMonthDay
}