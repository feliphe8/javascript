// Constructor
function Book(title, author, year){
    console.log('Book initialized');
    this.title = title;
    this.author = author;
    this.year = year;

}

// getSummary
Book.prototype.getSummary = function(){
    return `${this.title} was written by ${this.author} in ${this.year}`;
};

function Magazine(title, author, year, month){
    Book.call(this, title, author, year);

    this.month = month;
}

// Inherit Prototype
Magazine.prototype = Object.create(Book.prototype);

const mag1 = new Magazine('Magazine One', 'John Doe', '2018', 'Jan');

// Use Magazine constructor
Magazine.prototype.constructor = Magazine;

console.log(mag1);