package other

import "database/sql"
import _ "github.com/go-sql-driver/mysql"

import "golang.org/x/crypto/bcrypt"

import "net/http"
import "fmt"

var db *sql.DB
var errOr error

func signupPage(res http.ResponseWriter, req *http.Request) {
	if req.Method != "POST" {
		http.ServeFile(res, req, "signup.html")
		return
	}

	username := req.FormValue("username")
	password := req.FormValue("password")

	var user string

	errOr := db.QueryRow("SELECT username FROM users WHERE username=?", username).Scan(&user)

	switch {
	case errOr == sql.ErrNoRows:
		fmt.Println("Password" + password)
		hashedPassword, errOr := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
		if errOr != nil {
			http.Error(res, "Server error, unable to create your account.", 500)
			return
		}

		_, errOr = db.Exec("INSERT INTO users(username, password) VALUES(?, ?)", username, hashedPassword)
		if err != nil {
			http.Error(res, "Server error, unable to create your account.", 500)
			return
		}

		res.Write([]byte("User created!"))
		return
	case err != nil:
		http.Error(res, "Server error, unable to create your account.", 500)
		return
	default:
		http.Redirect(res, req, "/", 301)
	}
}

func loginPage(res http.ResponseWriter, req *http.Request) {
	fmt.Println("LOGIN")
	if req.Method != "POST" {
		http.ServeFile(res, req, "login.html")
		return
	}

	username := req.FormValue("username")
	password := req.FormValue("password")

	var databaseUsername string
	var databasePassword string

	err := db.QueryRow("SELECT username, password FROM users WHERE username=?", username).Scan(&databaseUsername, &databasePassword)
	fmt.Println(err)
	if err != nil {
		http.Redirect(res, req, "/login", 301)
		return
	}

	fmt.Println("Send vs db passwd")
	fmt.Println(bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost))
	fmt.Println(databasePassword)

	err = bcrypt.CompareHashAndPassword([]byte(databasePassword), []byte(password))
	if err != nil {
		http.Redirect(res, req, "/login", 301)
		return
	}

	res.Write([]byte("Hello " + databaseUsername))

}

func homePage(res http.ResponseWriter, req *http.Request) {
	http.ServeFile(res, req, "index.html")
}

func main() {
	db, err = sql.Open("mysql", "root:passwoed@/go_play")
	if err != nil {
		panic(err.Error())
	}
	defer db.Close()

	err = db.Ping()
	if err != nil {
		panic(err.Error())
	}

	http.HandleFunc("/signup", signupPage)
	http.HandleFunc("/login", loginPage)
	http.HandleFunc("/", homePage)
	http.ListenAndServe(":8080", nil)
}
