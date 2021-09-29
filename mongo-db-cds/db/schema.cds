namespace sap.mongo.db;

entity Orders{
  key orderNo    : String;
  key ItemNo     : String;
  Material       : String;
  Quantity       : Integer;
  QUOM           : String;
  Price          : Double;
  Currency       : String;
  OrderCreatedOn : String
};

entity Materials{
  key Material : String;
  ImageData: String;  
  ImageContentType: String @Core.IsMediaType;
  Description : String 
};