using { sap.mongo.db as my } from '../db/schema';

service MyOrders @(path: '/odata/mongodb/MyOrders')
{
   entity Orders as projection on my.Orders;  
}

service MyMaterials @(path: '/odata/mongodb/MyMaterials')
{
   entity Materials as projection on my.Materials; 
}