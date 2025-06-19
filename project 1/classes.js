class Book {
    constructor(title, author, year, isbn){
        this.title = title;
        this.author = author;
        this.year =year;
        this.isbn = isbn;
        this.available= true;
    }
}
class User {
    constructor(name, email, id){
       this.name=name;
       this.email=email;
       this.id=id ;
       this.borrowedBooks =[];

    }
}
class Library {
    constructor(){
        this.books =[];
        this.users =[];
        this.borrowed =[];
    }
    addBook(book) {
      this.books.push(book);
      return true;
   
    }


    deleteBook(isbn) {
       this.books = this.books.filter(book => book.isbn !== isbn);
       
    }
    addUser(user) {
        this.users.push(user);
        
    }
    deleteUser(userId) {
        this.users = this.users.filter(user => user.id !== userId);
        
    }
    borrowBook(isbn, userId){
        const book = this.books.find(b =>  b.isbn === isbn && b.available);
        const user = this.users.find(u => u.id === userId);
        if(book && user && book.available) {
            book.available = false;
            user.borrowedBooks.push(book);
            this.borrowed.push({book, user});
            return true;
        }
        return false;
    }
    returnBook(isbn) {
        const record = this.borrowed.find(b => b.book.isbn === isbn);
        if(record){
            record.book.available = true;
            record.user.borrowedBooks = record.user.borrowedBooks.filter(b => b.isbn !== isbn);
            this.borrowed = this.borrowed.filter(b => b.book.isbn !== isbn);
            return true;
        }
        return false;
    }

    
    
}

class UI {
    static displayBooks(library, keyword =" "){
        const bookList = document.getElementById("bookList");
        bookList.innerHTML =" ";
        const filteredbooks = library.books.filter(book =>{
            const search=keyword.toLowerCase();
            return (
                book.title.toLowerCase().includes(search) ||
                book.author.toLowerCase().includes(search) ||
                book.isbn.toLowerCase().includes(search)
            );
        });
            
        
        if(filteredbooks.length === 0){
            bookList.innerHTML = "<p>No books found</p>";
            return;
        }
        filteredbooks.forEach(book =>{
            const div = document.createElement("div");
            div.className='item';
            div.innerHTML = `
                <strong>${book.title}</strong> by ${book.author} (${book.year})<br/>
                ISBN: ${book.isbn} - <em>${book.available ? "available" :"Borrowed"}</em><br/>
                <button onclick ="handleBorrow('${book.isbn}')">Borrow</button>
                <button onclick ="handleDeleteBook('${book.isbn}')">Delete</button>
            `;
            bookList.appendChild(div);
        });
    }
    static displayUsers(library){
        const tbody = document.getElementById("userList");
        tbody.innerHTML ="";
        library.users.forEach(user =>{
            const tr = document.createElement("tr");
            tr.innerHTML = `
               <td>${user.name}</td>
               <td>${user.email}</td>
               <td>${user.id}</td>
               <td>
                  <button onclick ="handleDeleteUser('${user.id}')">Delete</button>
                </td>  
            `;
            tbody.appendChild(tr);
        });
    }
    static displayBorrowed(library){
        const tbody = document.getElementById("borrowList");
        tbody.innerHTML ="";
        library.borrowed.forEach(entry =>{
            const tr = document.createElement("tr");
            tr.innerHTML = ` 
               <td>${entry.book.title}</td>
               <td>${entry.user.name}</td>
               <td>
                  <button onclick =" handleReturn('${entry.book.isbn}')"> Return</button>
                </td>  
            `;
            tbody.appendChild(tr);
        })
    }
    static showMessage(msg, duration = 2000){
        const box = document.getElementById("messageBox");
        box.textContent= msg;
        box.classList.remove("hidden");
        setTimeout(() => box.classList.add("hidden"), duration);
    }
}

const bookForm = document.getElementById("bookForm");
const userForm = document.getElementById("userForm");
const searchInput = document.getElementById("searchInput");
 
bookForm.addEventListener("submit", e => {
    e.preventDefault();
    const title = document.getElementById("title").value.trim();
    const author = document.getElementById("author").value.trim();
    const year = document.getElementById("year").value.trim();
    const isbn = document.getElementById("isbn").value.trim();
    
    const book = new Book(title, author, year, isbn);
    library.addBook(book);
    UI.displayBooks(library, "");
    UI.showMessage("Book Added");
    e.target.reset();
});

userForm.addEventListener("submit", e =>{
    e.preventDefault();
    const name = document.getElementById("username");
    const email = document.getElementById("email");
    const id = document.getElementById("userId");

    const user = new User(name.value, email.value, id.value);
    library.addUser(user);
    UI.displayUsers(library);
    UI.showMessage("User Added");
    e.target.reset();
});
searchInput.addEventListener("input", e=>{
    const keyword = e.target.value;
    UI.displayBooks(library, keyword);
});


const library= new Library();

UI.displayBooks(library);
UI.displayUsers(library);
UI.displayBorrowed(library);

function handleDeleteBook(isbn){
    library.deleteBook(isbn);
    UI.displayBooks(library);
    UI.displayBorrowed(library);
    UI.showMessage("Book Deleted");
}


function handleDeleteUser(id){
    library.deleteUser(id);
    UI.displayUsers(library);
    UI.displayBorrowed(library);
    UI.showMessage("User Deleted");
}

function handleBorrow(isbn){
    const userId = prompt("Enter User ID to borrow:");
    const succes = library.borrowBook(isbn, userId);
    if(succes){
        UI.displayBooks(library);
        UI.displayBorrowed(library);
        UI.displayUsers(library);
        UI.showMessage("Book Borrowed");
    } else {
        UI.showMessage("cannot borrow this book,", 2500);
    }

}

function handleReturn(isbn){
    const succes= library.returnBook(isbn);
    if(succes){
        UI.displayBooks(library);
        UI.displayBorrowed(library);
        UI.displayUsers(library);
        UI.showMessage("Book Returned");
    } else {
        UI.showMessage("Error Returning book");
    }
}