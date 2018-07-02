const s = 'Hello';
console.log(typeof s);

const s2 = new String('Hello');
console.log(typeof s2);

console.log(window); // window is the parent object

console.log(navigator.appVersion);

// Object literal
const book1 = {
    title: 'Book one',
    author: 'John Doe',
    year: '2013',
    getSummary: function(){
        return `${this.title} was written by ${this.author} in ${this.year}`;
    }
}

console.log(book1.getSummary());
console.log(Object.values(book1));
console.log(Object.keys(book1));