window.onload = setInitDarkness

function setInitDarkness()
{
    if(checkDark())
    {
        toggleDarkNoSideEffects();
        console.log("should be dark");
    }
}
function checkDark()
{
    if(document.cookie== "")
    {
        document.cookie = "dark=0"
        return false
    }
    return parseInt(document.cookie.split("; ").find(row => row.startsWith("dark=")).split("=")[1]);
}

function toggleDarkNoSideEffects()
{
    var body = document.body;
    body.classList.toggle("dark");
    var button = document.getElementById("toggle-button");
    var about = document.getElementById("nav-about");
    var blog = document.getElementById("nav-blog");
    button.classList.toggle("toggle-light");
    button.classList.toggle("toggle-dark");
    about.classList.toggle("toggle-light");
    about.classList.toggle("toggle-dark");
    blog.classList.toggle("toggle-light");
    blog.classList.toggle("toggle-dark");
}

function toggleDark() {
    toggleDarkNoSideEffects();
    document.cookie = checkDark() ? "dark=0" : "dark=1"; // flip the dark flag;
}
