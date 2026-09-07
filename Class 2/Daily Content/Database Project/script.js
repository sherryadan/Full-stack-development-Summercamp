const SUPABASE_URL = "https://tuzyxoozrdzxbbdskose.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1enl4b296cmR6eGJiZHNrb3NlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODc5Mjk5NiwiZXhwIjoyMTA0MzY4OTk2fQ.edK6UjqOVlADcSf6W8EbByeG__BcfoiUVVGhrw-u01s";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

// Html elements 
const noteForm = document.getElementById("noteForm");
const noteInput = document.getElementById("noteInput");
const noteList = document.getElementById("noteList");


// Fetch Notes
async function getNotes(){
    const {data, error} = await supabaseClient
    .from("notes")
    .select("*")
    .order("created_at", {ascending: false});

    if(error){
        console.error(error);
        return;
    }
    displayNotes(data);
};

// Display Notes
function displayNotes(notes){
    noteList.innerHTML = "";
    notes.forEach(function(note){
        const noteElement = document.createElement("div");
        noteElement.classList.add("note");
        noteElement.innerHTML = `
        <span>${note.content}</span>
        <button class="delete-btn" onclick="deleteNote(${note.id})">Delete</button>`;

        noteList.appendChild(noteElement);
    })
}

// Add Notes 

noteForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const content = noteInput.value.trim();

    if(!content){
        return;
    }
    const {error} = await supabaseClient
    .from("notes")
    .insert([
        {
            content : content
        }
    ]);
    if (error) {
        console.error(error);
        alert("Something went wrong");

        return;
    }
    noteInput.value = "";

    getNotes();
});

// delete notes 

async function deleteNote(id){
    const {error} = await supabaseClient 
    .from("notes")
    .delete()
    .eq("id", id);

    if(error){
        console.error(error);
        alert("Note cant be deleted ");

        return;
    }
    getNotes();
}

// Load Notes When Page opens

getNotes();
