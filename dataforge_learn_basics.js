/* 
###########################   data-forge  basics ###########################################
Very basic operations with data-forge library.

@ref1: https://github.com/data-forge/data-forge-ts/
@ref2: http://www.data-forge-js.com/
@ref3: https://archive.ics.uci.edu/ml/datasets/Bank+Marketing
*/

const dataForge = require('data-forge');

// ## Create a new DataFrame
let df = new dataForge.DataFrame({
    columnNames: ["age","job","marital","education","default","balance","housing","loan","contact","day","month","duration","campaign","pdays","previous","poutcome","y"],
    rows: [
        [58,"management","married","tertiary","no",2143,"yes","no","unknown",5,"may",261,1,-1,0,"unknown","no"],
        [44,"technician","single","secondary","no",29,"yes","no","unknown",5,"may",151,1,-1,0,"unknown","no"],
        [33,"entrepreneur","married","secondary","no",2,"yes","yes","unknown",5,"may",76,1,-1,0,"unknown","no"],
        [47,"blue-collar","married","unknown","no",1506,"yes","no","unknown",5,"may",92,1,-1,0,"unknown","no"],
        [33,"unknown","single","unknown","no",1,"no","no","unknown",5,"may",198,1,-1,0,"unknown","no"],
        [35,"management","married","tertiary","no",231,"yes","no","unknown",5,"may",139,1,-1,0,"unknown","no"],
        [28,"management","single","tertiary","no",447,"yes","yes","unknown",5,"may",217,1,-1,0,"unknown","no"],
        [42,"entrepreneur","divorced","tertiary","yes",2,"yes","no","unknown",5,"may",380,1,-1,0,"unknown","no"],
        [58,"retired","married","primary","no",121,"yes","no","unknown",5,"may",50,1,-1,0,"unknown","no"],
        [43,"technician","single","secondary","no",593,"yes","no","unknown",5,"may",55,1,-1,0,"unknown","no"],
        [41,"admin.","divorced","secondary","no",270,"yes","no","unknown",5,"may",222,1,-1,0,"unknown","no"],
        [29,"admin.","single","secondary","no",390,"yes","no","unknown",5,"may",137,1,-1,0,"unknown","no"],
        [53,"technician","married","secondary","no",6,"yes","no","unknown",5,"may",517,1,-1,0,"unknown","no"],
        [58,"technician","married","unknown","no",71,"yes","no","unknown",5,"may",71,1,-1,0,"unknown","no"],
        [57,"services","married","secondary","no",162,"yes","no","unknown",5,"may",174,1,-1,0,"unknown","no"],
        [51,"retired","married","primary","no",229,"yes","no","unknown",5,"may",353,1,-1,0,"unknown","no"],
        [45,"admin.","single","unknown","no",13,"yes","no","unknown",5,"may",98,1,-1,0,"unknown","no"],
        [57,"blue-collar","married","primary","no",52,"yes","no","unknown",5,"may",38,1,-1,0,"unknown","no"],
        [60,"retired","married","primary","no",60,"yes","no","unknown",5,"may",219,1,-1,0,"unknown","no"],
        [33,"services","married","secondary","no",0,"yes","no","unknown",5,"may",54,1,-1,0,"unknown","no"],
        [28,"blue-collar","married","secondary","no",723,"yes","yes","unknown",5,"may",262,1,-1,0,"unknown","no"],
        [56,"management","married","tertiary","no",779,"yes","no","unknown",5,"may",164,1,-1,0,"unknown","no"],
        [32,"blue-collar","single","primary","no",23,"yes","yes","unknown",5,"may",160,1,-1,0,"unknown","no"],
        [25,"services","married","secondary","no",50,"yes","no","unknown",5,"may",342,1,-1,0,"unknown","no"],
        [40,"retired","married","primary","no",0,"yes","yes","unknown",5,"may",181,1,-1,0,"unknown","no"],
        [44,"admin.","married","secondary","no",-372,"yes","no","unknown",5,"may",172,1,-1,0,"unknown","no"],
    ],
});
console.log(df.toString());

// ### Drop a column
// It seems some columns have "unknown" value in every records, better to drop them.
df = df.dropSeries(["contact", "poutcome"]);
console.log(df.toString());

// ## What if we want to know how many single people are there?

// ### Counting records
// First of all let's count the number of people in this dataset.
// Nowing that the number of people is equal to the number of rows it is quite easy.
const nPeople = df.count();
console.log(`There are ${nPeople} people in this dataset`);

// ### Filter records
// Who are the singles in here?
// It's just about to ask "Gimme all the rows, WHERE each row.marital is 'single' ".
const df_singles = df.where( row => row.marital === 'single');
console.log(`Here come the unmarried ones!\n${df_singles.toString()}`);

// ### Counting on filtered rows
// Now we can answer to the starting question
const nSingles = df_singles.count();
console.log(`There are ${nSingles} singles inside this dataset`);

// We can even conut the percentage of the along the entire dataset
console.log(`...and they are ${parseInt(100*nSingles/nPeople)}% of this dataset`);

// If we don't want to spread variables around we can do all in one chain.
nPeople_chained = df.where( row => row.marital === 'single').count();

// ## What if we want to know how much is the average single admins balance?
// We now have a double condition to check, let's see how.

// ### Filter records, multiple condition
const df_singles_admin = df.where( row => row.marital === 'single' && row.job === 'admin.' );
console.log(`Introducing you the single administrative employees\n${df_singles_admin.toString()}`);

// ### Take a field
// In order to compute the average of the balance, we need to extract that column
// This is possible getting it as a Series, by _getSeries_ .
const df_singles_admin_balance = df_singles_admin.getSeries('balance');
console.log(`... this is their balance\n${df_singles_admin_balance.toString()}`);

// ### Summing along a column
const singlesAdminsTotPay = df_singles_admin_balance.sum();
console.log(`... having a total equal to \n${singlesAdminsTotPay}`);

// ### Averaging a column
console.log(`... so the average balance is \n${(singlesAdminsTotPay/df_singles_admin.count())}`);
// You have many ways to do it, in facts.
// There is a very easy dedicated function average().
console.log(`... still the balance is \n${(df_singles_admin_balance.average())}`);
// And if you prefer not spreading around variables, you can chain as before.
let singlesAdminsTotPay_chained = df.where( row => row.marital === 'single' && row.job === 'admin.' ).getSeries('balance').average();
console.log(`... I told you ${singlesAdminsTotPay_chained} was the average balance for single admins in here`);