function fn(){
    var num=10;
    return function (){
        return num++;
    }
}

var num=fn();
    num();
    num();