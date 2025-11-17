// Custom Error
const errorhandler=(statuscode,message)=>{
    // This is Inbuilt JS Error Class
    const error=new Error();  
    error.message=message;
    error.statuscode=statuscode;

    return error;



};
module.exports=errorhandler;
