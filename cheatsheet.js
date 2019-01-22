/* 
###########################   data-forge  cheat-sheet ###########################################
Just some examples of use of data-forge, a pandas/LINQ inspired nodejs module

@source: https://github.com/data-forge/data-forge-ts/blob/HEAD/docs/guide.md#driving-principles
@ref1 : http://www.data-forge-js.com/
@ref2 : [parse CSV doc](http://csv.adaltas.com/parse/)

NOTES:
    ! CAVEAT: using withIndex associated with transformSeries is very dangerous!! It seems failing the referencing
*/

//requrires
const dataForge = require('data-forge');


//Parameters
const dsPath = './datasets/bank-full.csv';

//1. # Read a locale dataset from CSV synchronously
//[@ref2:]
const fs = require('fs');
let dsCsv = fs.readFileSync(dsPath, "utf8");
let df1 = dataForge.fromCSV(dsCsv);
console.log(df1.toString());


//var df1= dataForge.readFileSync( ds1 ).parseCSV();
//var df1= dataForge.readFileSync( ds1 ).parseJSON();

// 1.0 A brand new DataFrame

let df_b = new dataForge.DataFrame({
    columnNames: [
        'subject_id',
        'first_name',
        'last_name',
    ],
    rows: [
        [1, 'Alex', 'Anderson'],
        [2, 'Amy', 'Ackerman'],
    ],
});

// 1.1 Instantiate a new Series
const newColRows = Array(20).fill(0);
let series1 = new dataForge.Series(newColRows);



//2. # Interact
// Print columns name
let cols = df1.getColumnNames();
console.log( df1.getColumnNames() ); //['age', 'job', 'marital',... ]

// Print the DataFrame
df1.toString();

// Get df as array
df1.toArray();

//Get the tot number of a series
df1.count();

// Extract a subset of columns
var subset = df1.subset( ["age", "balance"] );
df1.subset(['age', 'balance']).orderBy( row=> row.age); //example

// Get a Column as a Series
df1.getSeries( cols[0] );//.toArray()
// Get a Numeric Column as a Series
df1.getSeries( cols[0] ).parseInts().toArray()

// Get a Row by index number
df1.at( 5 );
// Get a value from a row
df1.at( 5 ).age; //df1.at( 5 )['age']

// Get a value from a row 2
age_from_row = ( arow )=>{ df1.at(arow)['age'] };

// Execute a callback over all rows
df1.forEach( row => {
    console.log(row['age'])
} );


// Get rows from/by intervals: take, between, skip
df1.take(5);  //takes the first 5 rows
df1.skip(20); //takes all rows after the first 20
df1.between(0,4); //easy to understand

// Get rows from the head or from the tail
df1.head(1).toArray()[0].age //takes the first element starting from the top
df1.at(0).age // equivalent of above
df1.head(10) //taakes the first 10 elements from the head


//Sorting: orderBy, orderBtyDescending, thenBy, thenByDescending
df1.orderBy( row => row.age ).forEach( row => { console.log(row['age']) } );


// Conditional slicing: where
df1.getColumns().where(column => column.name !== "balance");


// ## MODIFY ##
// Adding a column - withseries
//      It generates a NEW DF, because you cannot modify the old one
var newDf = df.withSeries("Some-New-Column", someNewSeries);
// Replacing a column - withseries
var newDf = df.withSeries("Some-Existing-Column", someNewSeries);
// Generating from function - withseries
var newDf = df.withSeries("Some-New-Column", 
	df => df.getSeries("Some-Existing-Column")
		.select(value => YOURFUNCTION(value))
);
// TRANSFORMING a column by function - withseries/transformseries
var newDf = df.withSeries("Some-Existing-Column", 
	df => df.getSeries("Some-Existing-Column")
		.select(row => YOURFUNCTION(row))
);
var newDf = df.transformSeries({
    "Some-Existing-Column": row => YOURFUNCTION(row), 
});

//
var newDf = df1.transformSeries({
    "age": row => row+'lovo', 
});
// replacing a numeric char column by a numeric one
var newDf = df1.withSeries( cols[0],  df1.getSeries( cols[0] ).parseInts() ); //newDf.getSeries(cols[0]).toArray()

// Elaborate a Series
df1.getSeries( col[0] ).parseInts().average() 

// Complex slicing composition
var sortedColumnsSubject = df1.getColumns()
    .where(column => column.name !== "age")
    .skip(2)
    .take(3)
    .orderBy(column => column.name);



// OUTPUT as JSON
df1.asJSON().writeFileSync('output.json');

// # CARTESIAN PRODUCT or CROSS JOIN
df_cross = df1.join(
    df2,
    l => l, // <-- no specified keys
    r => r, // <-- no specified keys
    (l,r) => {
        return{
            left: l.COLUMN_FROM_DF1,
            right: r.COLUMN_FROM_DF2,
        }
    }
)
