
//with B62 hashing we can scale the application. 
function generate(counter){
    const s = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';//create 62 character string
    var hash_str='';
    while(counter >0){
        hash_str = s.charAt(counter % 62) + hash_str;
        counter = Math.floor(counter / 62);
    }
    return hash_str;
}
//tell nodejs that we will use generaet in other function. 
module.exports = generate;
