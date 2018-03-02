
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
  menu();
});

function menu(){
	inquirer.prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View Product Sales by Department",
        "Create New Department"
      ]
    }).then(function(choice){
    	switch(choice.action){
    		case "View Product Sales by Department":
    			viewSales();
    			break;

    		case "Create New Department":
    			createDepartment();

    	}
    });
}

function viewSales(){
  var majorArray = [];
  var minorArray = [];

	var query = "SELECT department_id, departments.department_name, over_head_costs, sum(product_sales) AS product_sales, sum(product_sales) - over_head_costs AS total_profit"
				+ " FROM products"
				+ " RIGHT JOIN departments ON departments.department_name = products.department_name"
				+ " GROUP BY department_id, departments.department_name";
	
	connection.query(query, function(err, res){
		for (var i = 0; i < res.length; i++) {

          minorArray = [];

          minorArray = [
            [res[i].department_id],[res[i].department_name],[res[i].over_head_costs],[res[i].product_sales],[res[i].total_profit]
          ];
          
          majorArray.push(minorArray);  
        }
        console.table(['Deparment ID', 'Department Name', 'Over Head Costs', 'Product Sales', 'Total Profit'], majorArray);
		    menu();
	});
}

function createDepartment(){
	inquirer.prompt([
		{
			name: "departmentName",
			message: "Name of Department: "
		}, {
			name: "overHead",
			message: "Amount of Over Head Costs: "
		}
	]).then(function(response){
			var query2 = "INSERT INTO departments (department_name, over_head_costs)"
 				     + "VALUES ('" + response.departmentName + "', '" + response.overHead + "', 0 , 0)";

 		connection.query(query2, function(err, res){
 			console.log(res.affectedRows + " departments added");
 			menu();
 		})


	})

}










