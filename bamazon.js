
var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require('console.table');

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  display();
});

function display(){
	var majorArray = [];
	 var minorArray = [];
	connection.query("SELECT * FROM products", function(err, res){
		for (var i = 0; i < res.length; i++) {
		  minorArray = [];

		  minorArray = [
		  	[res[i].item_id],[res[i].product_name],[res[i].department_name],[res[i].price],[res[i].stock_quantity],[res[i].product_sales]
		  ];
		  
		  majorArray.push(minorArray);	

        }
        console.table(['Item ID', 'Name', 'Department', 'Price', 'Quantity', 'Sales'], majorArray);
		requestItem();
	});
}


function requestItem(){
	inquirer.prompt([
		{
			name: "id_product",
			message: "Enter ID of product you would like to purchase: "
		}, {
			name: "quantity",
			message: "Quantity of item: "
		}
	]).then(function(response){
		var choice = Number(response.id_product);
		
		connection.query("SELECT * FROM products WHERE item_id = ?", [choice], function(err, res){
			
			if(res[0].stock_quantity >= response.quantity ){
				var quantity = res[0].stock_quantity;
				quantity-=response.quantity;

				var itemID = res[0].item_id

  				connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?", [quantity, itemID], function (err, res) {
	    			if (err) throw err;
	    			console.log(res.affectedRows + " record(s) updated");
  				});

  				//Making sure it will add the sale to the product sales instead of replacing it
  				var prevCost = Number(res[0].product_sales);

  				connection.query("UPDATE products SET product_sales = ? WHERE item_id = ?", [(res[0].price*response.quantity) + prevCost, itemID], function(err,res){
  					if (err) throw err;
  					console.log(res.affectedRows + " prices added");
  				})

  				console.log("Cost of transaction: " + (res[0].price*response.quantity));
			}
			else{
				console.log("Not enough in stock, sorry!");
			}
			display();
		});
	
	});		
	

}









