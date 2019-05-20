/* 
###########################   data-forge  learning ###########################################
Just some examples of use of data-forge, a pandas inspired nodejs module 

It is a wrapper module that comprises many other libraries useful to perform data anaylsis.

@source: https://github.com/data-forge/data-forge-ts/blob/HEAD/docs/guide.md#driving-principles
@ref1 : http://www.data-forge-js.com/
@ref2 : [parse CSV doc](http://csv.adaltas.com/parse/)
@ref3 : https://github.com/gianfa/tutorials-dataForge
*/

// ########### HELPERS #########
const util = require('util');
const inspect = x => console.log(`\n${util.inspect(x, false, null, true /* enable colors */)}`); // sbrodola gli oggetti a video

const console_title = (txt) => console.log(
  '\x1b[35m%s\x1b[0m',
  '\n\n\n______________________________    '+ txt +'     _______________________'
);
const console_name = (txt) => console.log('\x1b[93m%s\x1b[0m',  '\n\t\t\t' + txt  );
//  ############################

//Requires
const dataForge = require('data-forge');

//Parameters
//var df1= dataForge.readFileSync( ds1 ).parseJSON();

// 0. A brand new DataFrame

let df1 = new dataForge.DataFrame({
    columnNames: [
        'subject_id',
        'pay',
        'first_name',
        'last_name',
        'job',
        'hired',
    ],
    rows: [
        [1, 10, 'Alex', 'Anderson', 'developer', new Date(2019,05,21)],
        [2, 20, 'Amy', 'Ackerman', 'developer', new Date(2019,07,21)],
        [3, 15, 'Joy', 'Anderson', 'developer', new Date(2019,05,22)],
        [4, 19, 'Carlton', 'Ackerman', 'human resources', new Date(2019,01,21)],
        [5, 17, 'Amy', 'Ackerman', 'business', new Date(2019,05,21)],
        [6, 19, 'Ronald', 'Levi', 'human resources', new Date(2019,05,21)],
    ],
});
console.log( df1.toString() );

// 0.1 Increment by 1 everyone's pay. Transform
//
df1 = df1.transformSeries({
    'pay': val => val +1
});
console_name('df1');
console.log(df1.toString());

// 0.1.2 Conditional Transform, condition on same column
df1_cond = df1
  .transformSeries({
    'pay': val => {return val > 17 ? val +20 : val }, // Apply a transformation to each value in the series.
  });
console.log('\n\nconditional 2');
console.log(df1_cond.toString());


// 0.1.3 Conditional Transform, condition on other column
df1_rich_devs = df1
  .where( r => r.job === 'developer')
  .transformSeries({
    'pay': val => val + 50, // Apply a transformation to each value in the series.
  });
df1_cond_2 = df1_rich_devs.concat(df1)
  .distinct(r => r.subject_id)

console.log('\n\nconditional3');
console.log(df1_cond_2.toString());
console.log(' ---- \n\n');


// 0.1.4 Multiple Distinct
df1_rich_devs = df1
  .where( r => r.job === 'developer')
  .transformSeries({
    'pay': val => val + 50, // Apply a transformation to each value in the series.
  });
df1_cond_2 = df1_rich_devs.concat(df1)
  .distinct(r => r.subject_id)
  .distinct(r => r.last_name)

console.log('\n\nMultiple distinct: subject.id, last_name');
console.log(df1_cond_2.toString());
console.log(' ---- \n\n');

// 0.1.5 Distinct by date
console_name('df1_d_bydate');
df1_d_bydate = df1
  .generateSeries( {'time' : r => r.hired.getTime()} )
  .distinct(r => r.time)
console.log('\n\n distinct by date');
console.log(df1_d_bydate.toString())

// 0.1.6 Distinct by index
console.log('\n\n distinct by index');
df_sets = df1.groupBy( r => r.job === 'developer');
dfx = df_sets.at(0)
  .transformSeries({
    'pay': val => val + 50, // Apply a transformation to each value in the series.
  })
  .concat( df_sets.at(1) );


// console.log('\n\n distinct by index');
console.log(dfx.toString())

console.log('\n\n___\n\n');
const good_idx = dfx.getIndex().distinct().getIndex();
console.log(dfx.getIndex().distinct().toString());




// return;
// 0.2 Look for Ackerman people. Where
//
df1_acker = df1.where(r => r.last_name == 'Ackerman');
console_name('df1_acker');
console.log(df1_acker.toString());

// 0.3 Look for Ackermans homonyms. Where, more conditions
// We see there are more Ackerman, but we look for Amy
df1_acker_amy = df1.where(r => r.last_name == 'Ackerman' && r.first_name == 'Amy' );
console_name('df1_acker_amy');
console.log(df1_acker_amy.toString());


console_title('CONCATENATION  (Vertical)');
// Concatenation (horiz)
console.log( df1_acker.concat(df1_acker_amy).toString() );

console.log(df1_acker_amy.toRows())

console.log(df1_acker_amy.toPairs())

const df1_ren = df1.renameSeries({
    pay : 'salary',
});
console.log(df1_ren.toString());
// let dfDate = new dataForge.DataFrame({
//     columnNames: [
//         'date',
//     ],
//     rows: [
//         [new Date('2018-05-21')],
//         [new Date('2018-05-22')],
//         [new Date('2018-05-23')],
//     ],
// });
// df1 = df1.transformSeries({
//     'subject_id': val => val +1
// });
// //console.log(df1.toString());


// df1 = new dataForge.DataFrame({
//     columnNames: [
//         'subject_id',
//         'first_name',
//         'date',
//     ],
//     rows: [
//         [1, 'Alex', new Date('2018/05/01')],
//         [2, 'Amy', new Date('2018/05/03')],
//     ],
// });


console_title('ZIP  (Horizontal)');

// Creating from [Object]
const obj =  [ 
{ _id: 'not relevant',
  hotel: '5c0bc556ec9e3a0028003f47',
  roomType: '5c0bcce5ec9e3a0028003f4e',
  date: new Date('2019-05-30T00:00:00.000Z') },
{ _id: 'not relevant',
  hotel: '5c0bc556ec9e3a0028003f47',
  roomType: '5c0bcce5ec9e3a0028003f4e',
  date: new Date('2019-05-31T00:00:00.000Z') },
{ _id: 'not relevant',
  hotel: '5c0bc556ec9e3a0028003f47',
  roomType: '5c0bcce5ec9e3a0028003f4f',
  date: new Date('2019-06-01T00:00:00.000Z') },
{ _id: 'not relevant',
  hotel: '5c0bc556ec9e3a0028003f47',
  roomType: '5c0bcce5ec9e3a0028003f4f',
  date: new Date('2019-06-02T00:00:00.000Z') } 
];
let df_hotel = new dataForge.DataFrame(obj);
console.log(df_hotel.toString());

// Creating from [Object]
const mp =  [ 
    { _id: 'not relevant',
      hotel: '5c0bc556ec9e3a0028003f47',
      roomType: '5c0bcce5ec9e3a0028003f4e',
      date: new Date('2019-05-30T00:00:00.000Z') },
    { _id: 'not relevant',
      hotel: '5c0bc556ec9e3a0028003f47',
      roomType: '5c0bcce5ec9e3a0028003f4e',
      date: new Date('2019-05-31T00:00:00.000Z') },
    { _id: 'not relevant',
      hotel: '5c0bc556ec9e3a0028003f47',
      roomType: '5c0bcce5ec9e3a0028003f4f',
      date: new Date('2019-06-01T00:00:00.000Z') },
    { _id: 'not relevant',
      hotel: '5c0bc556ec9e3a0028003f47',
      roomType: '5c0bcce5ec9e3a0028003f4f',
      date: new Date('2019-06-02T00:00:00.000Z') } 
    ];
    let df_hotelMap = new dataForge.DataFrame(mp);
    console.log(df_hotelMap.toString());


console_name('df2');
let df2 = new dataForge.DataFrame({
columnNames: [
    'Fruits',
],
rows: [
    ['Pear'],
    ['Apple'],
    ['Melon'],
    ['Strawberry'],
],
});
console.log(df2.toString());

console_name('df1.zip( df2 )');
let df3 = df1.zip(
    df2,
    (a, b) => {
        return{
        uno:  a.first_name,
        due: b.Fruits,
        };
    }
);
console.log(df3.toString());


df3 = df2.zip(
    df1,
    (a, b) => {
        return{
        uno:  b.first_name,
        due: a.date,
        };
    }
);
//console.log(df3.toString());

df4 = df1.join(
    df2,
    l => l,
    r => r,
    (l,r) => {
        return{
            left: l.first_name,
            right: r.date,
        }
    }
)

// console.log(df4.toString());

const df5 = df2.groupBy(r => r.roomType);

console.log('df5');
console.log(df5.toString());
console.log(df5 instanceof dataForge.Series);

for (group of df5){
    console.log(
        group
         .toString(),
         );    
}
console.log(df5.toString());


const obj2 = {
    one: 1,
    two: "2",
}



// _______________
console_title('TRANSFORM SERIES');

console_name('a1');
const a = new dataForge.DataFrame([
  {C1: [180,123], C2: [120,123], 'date': 'ciao', name: 'John'},
  {C1: [180,123], C2: [120,123], 'date': 'comeo', name: 'Lay'},
  {C1: [180,123], C2: [120,123], 'date': 'ciao', name: 'Bert'},
  {C1: [180,123], C2: [120,123], 'date': 'lavello', name: 'Lay'},
  {C1: [180,123], C2: [120,123], 'date': 'ciao', name: 'Bert'},
  {C1: [180,123], C2: [120,123], 'date': 'ciao', name: 'Mart'},
  {C1: [180,123], C2: [120,123], 'date': 'ciao', name: 'Forn'},
])
console.log(a.toString())

const funInsideArray = elem => elem * 1.4;
const funOnArray = arr => {
  const res = Array(arr.length);
  let c = 0;
  for (const sel of arr) {
    res[c] = funInsideArray(sel);
    c +=1;
  }
  return res;
}

console_name('a2');
a2 = a.transformSeries({
  C1 : funOnArray,
});
console.log(a2.toString())



console_name('#withS');
/* Applica una funzione _func_ ad ogni elemento di un
    array contenuto in una colonna.
*/
const func = el => el * 0.5;
const funOverArray = (arr, func) => {
  const res = Array(arr.length);
  let c = 0;
  for (const sel of arr) {
    res[c] = func(sel);
    c +=1;
  }
  return res;
}
const withS = (dfIn, column, fun) => {
  const funVal = r => funOverArray(r[column], fun);
  const funRow = df => df.select( funVal );
  return dfIn.withSeries( 
    column, funRow
   );
}
const column = 'C1';
console_name('a3');
let a3 = withS(a, column, func);console.log(a3.toString())

// ____
console_name('#withS all columns');
const withSMore = (dfIn, columns, fun) => {
  let res = dfIn;
  for( let i = 0; i < columns.length; i += 1 ){
    const col = columns[i];
    res = withS(res, col, fun)
  }
  return res;
}
console_name('a3');
a3 = withSMore(a, ['C1', 'C2'], func); console.log(a3.toString())


// console_name('a3 where + transform');
// const where1 = r => r.date === 'ciao';
// const colToMod = 'C1';
// const objts = {};
// objts[colToMod] = r => 'modificato'
// const a3w = a3.where(where1).transformSeries(objts);
// a3mod = a3.joinOuterLeft(
//   a3w,
//   l => [l.date, l.name],
//   r => [r.date, r.name],
//   (l,r) => l,
// )
// console.log(a3mod.bake().getIndex().toString());
// console.log(a3.where().toString());
//console.log(a3.merge(a3mod))

//a3 = df.pivot(['job'])



console_name('a3.date toArray()');
console.log(a3.getSeries('date').toArray());

console_name('for i of a3');
for (const i of a3) {
  console.log(i);
}


// _______________
console_title('GROUP BY');
console_name('df1_d_bydate groupBy job');
cond = r => r.job;
df1_g_job = df1_d_bydate.groupBy(cond);
console.log(df1_g_job.toString());
console.log('COUNT: '+ df1_g_job.count() +' (windows)');


console_name('df1_d_bydate groupBy Nothing');
cond = r => true;
df1_g_ = df1_d_bydate.groupBy(cond);
console.log(df1_g_.toString());
console.log('COUNT: '+ df1_g_.count() +' (windows)');

console_name('df1_d_bydate groupBy job, First group');
console.log(df1_g_job.at(0).toString());

console_name('df1_d_bydate groupBy Nothing, second group type');
console.log(df1_g_.count().toString());

// _______________


console_title('AGGREGATE: SELECT + GROUP BY');
console_name('df1 - pay.min()');
df1_pay_min = df1
    .groupBy(row => row.job)                      // "look over the jobs...
    .select(group => ({
      first_name: group.first().first_name,
      pay: group.deflate(row => row.pay).min(),   // ...for the less payed"
      job: group.first().job, // Sum sales per client.
    }))
    .inflate(); // Series -> dataframe.

console_name('df1 - pay.max()');
df1_pay_max = df1
    .groupBy(row => row.job)
    .select(group => ({
      first_name: group.first().first_name,
      pay: group.deflate(row => row.pay).max(),
      job: group.first().job, // Sum sales per client.
    }))
    .inflate() // Series -> dataframe.

console.log(df1_pay_min.toString());
console.log(df1_pay_max.toString());


// _______________

console_title('PIVOT');
console_name('df1');
console.log(df1.toString());
// df1.pivot( groupByCol, overThisCol, ExecuteThisOnRows r => r.sum());
df1_pvt = df1.pivot('first_name', 'pay', r => r.sum());
console_name("df1.pivot('first_name', 'pay', r => r.sum();");
console.log(df1_pvt.toString());

// _______________
console_title('OUTPUT');
console_name('df1 at 0');
df1_a_0 = df1.at(0);
console.log(df1_a_0);
console_name('df1 at first index');
df1_a_fi = df1.at( df1.getIndex().at(0) );
console.log(df1_a_fi);
