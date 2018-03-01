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
  menu();
});

function menu(){
	inquirer.prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View Products for Sale",
        "View Low Inventory",
        "Add to Inventory",
        "Add New Product"
      ]
    }).then(function(choice){
    	switch(choice.action){
    		case "View Products for Sale":
    			display();
    			break;

    		case "View Low Inventory":
    			lowInventory();
    			break;

    		case "Add to Inventory":
    			addInventory();
    			break;

    		case "Add New Product":
    			addProduct();

    	}
    });
}

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
	    menu();
	});
}

function lowInventory(){
	connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err, res){
		console.log("Items with low inventory: ");
		for(var i = 0; i < res.length; i++){
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
		menu();
	});
}

function addInventory(){

	inquirer.prompt([
		{
			name: "idChoice",
			message: "Choose the ID of the item you would like to update: "
		}, {
			name: "newQuantity",
			message: "How much more would you like to add?"
		}
	]).then(function(response){
		connection.query("SELECT * FROM products WHERE item_id = ?", [response.idChoice], function(err, res){
			var amount = Number(response.newQuantity);
			var sum = amount + res[0].stock_quantity;

			connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?", [sum, res[0].item_id], 
					function(err, res){
						if (err) throw err;
	    				console.log(res.affectedRows + " record(s) updated");
					});
			display();

		});
	});
}

function addProduct(){
	inquirer.prompt([
		{
			name: "productName",
			message: "Name of product: "
		}, {
			name: "departmentName",
			message: "Name of department: "
		}, {
			name: "price",
			message: "Price of item: "
		},	{
			name: "stockQuantity",
			message: "Stock of Quantity: "
		}, {
			name: "overheadCosts"
			message: "Overhead Cost of Department: "
		}	
	]).then(function(response){
		var query = "INSERT INTO products (product_name, department_name, price, stock_quantity)"
					+ "VALUES ('" + response.productName + "', '" + response.departmentName + "', '" 
					+ response.price + "', '" + response.stockQuantity + "')";

		connection.query(query, function(err, res){
			if (err) throw err;
			console.log(res.affectedRows + " record added");

			display();
		});
	});	


}



