import {
  Field,
  PublicKey,
  PrivateKey,
  Encoding,
  Group,
  Encryption,
  initializeBindings
} from "o1js";

export { CypherText };

interface CypherTextObject {
  cipherText: Field[];
  publicKey: Group;
}

class CypherText {

  static stringify(cipherText: CypherTextObject): string {
    return JSON.stringify(cipherText);
  }

  static parse(jsonStr: string): CypherTextObject {
    let obj = JSON.parse(jsonStr);
    return {
      publicKey: new Group(obj.publicKey),
      cipherText: (obj.cipherText || []).map((t: string) => Field(t))
    }
  }

  static encrypt(
    message: string, 
    publicId: string
  ): string {
    try {
      let fields: Field[] = Encoding.stringToFields(message);
      let encripted = Encryption.encrypt(
        fields, 
        PublicKey.fromBase58(publicId)
      )
      return CypherText.stringify(encripted) ;
    }
    catch (err) {
      throw Error(
        `Could not encrypt message='${message}' using key='${publicId}'.`
        +` Error ${err}`
      )
    }
  }  
  
  static decrypt(
    cipherText: string, 
    privateKey: string
  ): string {
    try {
      let fields = Encryption.decrypt(
        CypherText.parse(cipherText), 
        PrivateKey.fromBase58(privateKey)
      );
      let decrypted = Encoding.stringFromFields(fields);
      return decrypted
    }
    catch (err) {
      throw Error(
        `Could not decrypt cipher='${cipherText}'.`
        +` Error ${err}`
      )
    }
  }

  static async initialize() {
    await initializeBindings();
  }
}

