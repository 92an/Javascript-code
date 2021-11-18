/**
 * Sorts an HTML table
 * 
 * @param {HTMLTableElement} table The table that the function will sort.
 * @param {number} column The column index of the column to sort.
 * @param {boolean} asc The Boolean that determines     if the order is ascending (TRUE) or descending (FALSE).
 */


function sort_table_by_column(table, column, asc = true) {
    const dir_modifier = asc ? 1 : -1;
    const tBody = table.tBodies[0];
    const rows = Array.from(tBody.querySelectorAll("tr"));


    // sort each row
    const sorted_rows = rows.sort((a, b) => {
        let aColText = a.querySelector(`td:nth-child(${ column + 1 })`).textContent.trim();
        let bColText = b.querySelector(`td:nth-child(${ column + 1 })`).textContent.trim();

        // paseFloat if the column is a number
        if (!isNaN(parseFloat(aColText)) && !isNaN(parseFloat(bColText))) {
            aColText = parseFloat(aColText)
            bColText = parseFloat(bColText)
        }

        return aColText > bColText ? (1 * dir_modifier) : (-1 * dir_modifier);
    });

    // remove existing TR from the table
    while (tBody.firstChild) {
        tBody.removeChild(tBody.firstChild);
    }

    // add the newly sorted rows
    tBody.append(...sorted_rows);

    // remember how the table is sorted
    table.querySelectorAll("th").forEach(th => th.classList.remove("th-sort-asc", "th-sort-desc"));
    table.querySelector(`th:nth-child(${ column + 1 })`).classList.toggle("th-sort-asc", asc);
    table.querySelector(`th:nth-child(${ column + 1 })`).classList.toggle("th-sort-desc", !asc);

};

document.querySelectorAll("table th").forEach(headerCell => {
    headerCell.addEventListener("click", () => {
        const tableElement = headerCell.parentElement.parentElement.parentElement;
        const headerIndex = Array.prototype.indexOf.call(headerCell.parentElement.children, headerCell);
        const currentIsAscending = headerCell.classList.contains("th-sort-asc")

       sort_table_by_column(tableElement, headerIndex, !currentIsAscending) 
    });
});

