export class HttpError extends Error{
  constructor(message , errorCode){
      super(message);//adds the message to the error property
      this.code = errorCode; // adds the code to the error property
  }
}

