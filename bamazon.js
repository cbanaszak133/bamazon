
var mysql = require("mysql");
var inquirer = require("inquirer");


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
	connection.query("SELECT * FROM products", function(err, res){
		for (var i = 0; i < res.length; i++) {
          console.log(
            "Item ID:  " +
              res[i].item_id +
              " || Product Name: " +
              res[i].product_name +
              " || Deparment Name: " +
              res[i].department_name +
              " || Price: " +
              res[i].price +
              " || Stock Quantity: " +
              res[i].stock_quantity
          );
        }
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

  				console.log("Cost of transaction: " + (res[0].price*response.quantity));
			}
			else{
				console.log("Not enough in stock, sorry!");
			}
			display();
		});
	
	});		
	

}









