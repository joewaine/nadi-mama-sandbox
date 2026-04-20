const Product = require("../model/Product");
const fetch = require("node-fetch");
const btoa = require("btoa");

// exports.menuItems = async (req, res) => {
//     // console.log('mamnoon pull menu')

//     try {
//       const request = await fetch('https://hq.breadcrumb.com/ws/v1/menus/online_ordering/', {
//         headers: {
//           'X-Breadcrumb-Username': `generic-online-ordering_mamnoon-llc`,
//           'X-Breadcrumb-Password': 'uQM8mseTvnTX',
//           'X-Breadcrumb-API-Key': `e2ebc4d1af04b3e5e213085be842acaa`
//         }
//       })
//       if (request.ok) {
//         const body = await request.json();
//         // console.log(body)
//         res.status(201).json({ body });

//         addMenuData(body,'mamnoon')

//         // upserveMongo('mamnoon')

//       }
//     } catch (err) {
//      res.status(400).json({ err: err });
//     }
//   }

const { ApiError, Client, Environment } = require("square");
const squareAccessToken =
  "EAAAEK85Di_9TYNqU6ysBeIE5Go9GMFULlZHJcQwhjEKfX2QX0Gqgk9Y4QhD9OGe";
const { v4: uuidv4 } = require("uuid");
const { object } = require("@apimatic/schema");
const { response } = require("express");
const { identity } = require("lodash");

// Create an instance of the API Client
// and initialize it with the credentials
// for the Square account whose assets you want to manage
const client = new Client({
  timeout: 3000,
  environment: Environment.Sandbox,
  accessToken: squareAccessToken,
});

const { catalogApi } = client;

exports.menuItems = async (req, res) => {
  try {
    const response = await catalogApi.listCatalog();

    let objectArr = [];
    for (let i in response.result.objects) {
      objectArr.push(response.result.objects[i]);
    }
    //// allows us to serialize the bigint malfunction
    const body = response.result.objects;
    BigInt.prototype.toJSON = function () {
      return Number(this.body);
    };

    const amount =
      body[0].itemData.variations[0].itemVariationData.priceMoney.amount;
    // BigInt.prototype.toJSON = function () {
    //   return Number(this.amount);
    // }
    ////////// I think we can't convert a 64-bit int on the frontend so we are getting a null error on the front end /////////
    //  console.log(`body body body body`, Number(body[0].itemData.variations[0].itemVariationData.priceMoney.amount))
    //  console.log(`body only`, body)
    //   res.status(201).json({ body, amount: Number(amount)
    //   // price:  atob(body[0].itemData.variations[0].itemVariationData.priceMoney.amount)
    // });

    let rslt = [];
    let obj = {
      name: "",
      description: "",
      amount: "",
      imgUrl: "",
    };

    let temp = {};

    for (let i = 0; i < objectArr.length; i++) {
      console.log("objectArr[i]", objectArr[i]);
      obj["name"] = objectArr[i].itemData.name;
      obj["description"] = objectArr[i].itemData.description;
      obj["amount"] = Number(
        objectArr[i].itemData.variations[0].itemVariationData.priceMoney.amount
      );
      if (objectArr[i].imageId) {
        try {
          temp = await viewCatObj(objectArr[i].imageId);
        } catch (error) {
          console.log(error);
        }
      }
      if (temp !== undefined && temp.result !== undefined) {
        let temp2 = JSON.stringify(temp.result.object.imageData.url);
        obj["imgUrl"] = temp2.substring(1, temp2.length - 1);
      }
      rslt.push(obj);
      obj = {};
    }
    console.log(`rslt array with only important info`, rslt);
    console.log("temp variable for img url", temp.result.object.imageData.url);

    res.status(201).json({
      body: { rslt },
      // price:  atob(body[0].itemData.variations[0].itemVariationData.priceMoney.amount)
    });

    // addMenuData(body,'mamnoon')
  } catch (error) {
    console.log(`error`, error);
  }
};

const viewCatObj = async (imgUrl) => {
  try {
    const response = await catalogApi.retrieveCatalogObject(imgUrl);
    console.log("response result", response.result);
    return response;
  } catch (error) {
    console.log(error);
  }
};
