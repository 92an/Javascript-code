// find number of tables
all_tables = document.querySelectorAll("table");


// loop through all tables
for (let table_index = 0; table_index < all_tables.length; table_index++) {
    var header_array = Array.from(all_tables[table_index].querySelectorAll("th"));

    // Print variables to console log in case for debugging - remove comments to view the table checks.
    // console.log("Start iteration output " + table_index + " printing table, array of headers, and length of header array to the log window");
    // console.log(all_tables[table_index]);
    // console.log(header_array);
    // console.log(header_array.length);
    // console.log("End of iteration output " + table_index);
    // console.log("Number of tables: " + all_tables.length);

    // set an index attribute and a div for filter box to all headers in each table
    for (let i = 0; i < header_array.length; i++) {
        header_array[i].setAttribute("index", i);
        header_array[i].insertAdjacentHTML('beforeend', '<div class="filter"></div>');
    };
};

// --------------------------
// Code to filter the table
//---------------------------

// Adding the EventListener to the headers of the table
document.querySelectorAll("th").forEach(function (table_header) {
  table_header.addEventListener("dblclick", function() {
    showFilterOption(this);
  })
});

// If the menu box is hidden make visible and hidden if it is visible on activation
function showFilterOption(thObject) {
  var filterGrid = thObject.querySelector(".filter");


  if (window.getComputedStyle(filterGrid).display !== "block") {
    filterGrid.style.display = "block";
  } else {
    filterGrid.style.display = "none";
  }

  // Create checkbox for select all
  var index = 0;
  while (filterGrid.firstChild) {
    filterGrid.removeChild(filterGrid.firstChild);
  }
  var allSelected = true;
  filterGrid.insertAdjacentHTML("beforeend", '<div><input id="all" type="checkbox" checked>Select All</div><hr/>');

  // variables to create list inside filter menu
  var rows = thObject.parentElement.parentElement.parentElement.querySelectorAll("tbody tr");
  var values = [];

  // loop through each row and find the unique values to populate the checklist.
  // This is done by populating an array (values) with the content of the current cell in the loop.
  // Only if the vale is not already in the array; first add the value to the array and create the item in the menu.
  rows.forEach(function(element, index) {
    var currentTd = element.children[thObject.getAttribute("index")];
    var currentTd2 = currentTd.children[thObject.getAttribute("index")];


    // if statement to segment two cases first where there is no <a> tag and the second where there is an <a> tag.

    if (currentTd2 === undefined) {
      if (!values.includes(currentTd.innerHTML)) {
        values.push(currentTd.innerHTML)
        var div = document.createElement("div");
        div.classList.add("grid-item");
        var str = !(window.getComputedStyle(element).visibility === "collapse") > 0 ? 'checked' : '';
        if (window.getComputedStyle(element).visibility === "collapse") {
          allSelected = false;
        };
        div.innerHTML =`<input type="checkbox" value="${currentTd.innerHTML}"  ${str} >  ${currentTd.innerHTML}` ;
        filterGrid.append(div);
        index++;
      }
    } else {
      if (!values.includes(currentTd2.innerHTML)) {
        values.push(currentTd2.innerHTML)
        var div = document.createElement("div");
        div.classList.add("grid-item");
        var str = !(window.getComputedStyle(element).visibility === "collapse") > 0 ? 'checked' : '';
        if (window.getComputedStyle(element).visibility === "collapse") {
          allSelected = false;
        };
        div.innerHTML =`<input type="checkbox" value="${currentTd2.innerHTML}"  ${str} >  ${currentTd2.innerHTML}` ;
        filterGrid.append(div);
        index++;
      }
    }

  });

  // Deselection of items using the all items checkbox
  if (!allSelected){
    filterGrid.querySelector("#all").checked = false;
  }

  // Create buttons for the filter menu
  filterGrid.insertAdjacentHTML("beforeend", '<hr/><div id="filter-button-row"><input id="close" type="button" value="Close"/><input id="ok" type="button" value="Ok"/></div>');


  // Create various variables representing the various components in the filter menu
  var closeBtn = filterGrid.querySelector("#close");
  var okBtn = filterGrid.querySelector("#ok");
  var checkElems = filterGrid.querySelectorAll("input[type='checkbox']");
  var gridItems = filterGrid.querySelectorAll(".grid-item");
  var all = filterGrid.querySelector("#all");

  // close button function - hide filter menu
  closeBtn.addEventListener("click", function() {
    filterGrid.style.display = "none";
    return false;
  });

  // ok Button function - loops through the checklist and for each item in the filter menu checklist loop through the rows of the table.
  // if Checked show matching row in table if unchecked hide matching row.
  okBtn.addEventListener("click", function() {
    filterGrid.querySelectorAll(".grid-item").forEach(function(grid_element, grid_index) {

      if (grid_element.querySelector("input").checked) {
        rows.forEach(function(row_element, row_index) {

          var currentTd = row_element.children[thObject.getAttribute("index")];
          var currentTd2 = currentTd.children[thObject.getAttribute("index")];

          // Hide function in the case where there is no anchor tag.
          if (currentTd2 ===  undefined) {
            if (grid_element.children[0].value == currentTd.innerHTML) {
              row_element.style.visibility = "visible";
            };
          };

          // Hide function in the case where there is an anchor tag.
          if (currentTd2 !=  undefined) {
            if (grid_element.children[0].value == currentTd2.innerHTML) {
              row_element.style.visibility = "visible";
            };
          };

        });
      };

      if (!grid_element.querySelector("input").checked) {
        rows.forEach(function(row_element, row_index) {

          var currentTd = row_element.children[thObject.getAttribute("index")];
          var currentTd2 = currentTd.children[thObject.getAttribute("index")];

          // Hide function in the case where there is no anchor tag.
          if (currentTd2 ===  undefined) {
            if (grid_element.children[0].value == currentTd.innerHTML) {
              row_element.style.visibility = "collapse";
            };
          };

          // Hide function in the case where there is an anchor tag.
          if (currentTd2 !=  undefined) {
            if (grid_element.children[0].value == currentTd2.innerHTML) {
              row_element.style.visibility = "collapse";
            };
          };

        });
      };

    filterGrid.style.display = "none";
    return false;
    });
  });

  // Prevents the same event to be called multiple times
  checkElems.forEach(item => {
    item.addEventListener("click", function(event) {
      event.stopPropagation();
    });
  });


  // checking the checkboxes in the filer menu
  gridItems.forEach(item => {
    item.addEventListener("click", function() {
      var chk = this.querySelector("input[type='checkbox']");
      chk.checked = !chk.checked;
    });
  });


  // function for selecting with the select all checkbox
  all.addEventListener("change", function() {
      var chk2 = this.checked;
      console.log(chk2);
      console.log(filterGrid.querySelectorAll(".grid-item"));
      filterGrid.querySelectorAll(".grid-item").forEach (item =>{
        if (chk2 == true) {
          item.querySelector("input").checked = true;
        } else {
          item.querySelector("input").checked = false;
        };
      });
    });


    // Prevents the same event to be called multiple times
  filterGrid.addEventListener("click", function(event) {
      event.stopPropagation();
    });

return filterGrid;
};





