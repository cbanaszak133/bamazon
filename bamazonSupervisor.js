
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

	var query = "SELECT department_id, departments.department_name, over_head_costs, sum(product_sales) AS product_sales, sum(product_sales) - over_head_costs AS total_profit"
				+ " FROM products"
				+ " INNER JOIN departments ON departments.department_name = products.department_name"
				+ " GROUP BY department_id, departments.department_name";
	
	connection.query(query, function(err, res){
		for (var i = 0; i < res.length; i++) {
          console.log(
            "Department ID:  " +
              res[i].department_id +
              " || Department Name: " +
              res[i].department_name +
              " || Over Head Costs: " +
              res[i].over_head_costs +
              " || Product Sales: " +
              res[i].product_sales +
              " || Total Profit: " +
              res[i].total_profit 
          );
        }
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
 				     + "VALUES ('" + response.departmentName + "', '" + response.overHead + "')";

 		connection.query(query2, function(err, res){
 			console.log(res.affectedRows + "departments added");
 			menu();
 		})


	})

}










