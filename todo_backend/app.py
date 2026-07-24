import sqlite3
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# ⚡ ADD YOUR LIVE VERCEL URL HERE TO PREVENT CORS ERRORS
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://vercel.app" 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def init_db():
    conn = sqlite3.connect("todo.db")
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            task TEXT NOT NULL,
            completed BOOLEAN NOT NULL DEFAULT 0
            )
    """)
    conn.commit()
    conn.close()

init_db()

@app.get("/")
def home():
    return {"message": "Welcome to my Python SQLite API! Navigate to /api/tasks to view tasks."}

@app.get("/api/tasks")
def get_tasks():
    conn = sqlite3.connect("todo.db")
    cursor = conn.cursor()
    cursor.execute("SELECT id, task, completed FROM tasks")
    rows = cursor.fetchall()
    conn.close()

    tasks_list = []
    for row in rows:
        tasks_list.append({
            "id": row[0],
            "task": row[1],
            "completed": bool(row[2])
        })
    return tasks_list

@app.post("/api/tasks")
def create_task(new_task: dict):
    conn = sqlite3.connect("todo.db")
    cursor = conn.cursor()
    cursor.execute("INSERT INTO tasks (task) VALUES (?)", (new_task["task"],))
    generated_id = cursor.lastrowid
    conn.commit()
    conn.close()

    return {
        "id": generated_id,
        "task": new_task["task"],
        "completed": False
    }

@app.delete("/api/tasks/{task_id}")
def delete_task(task_id: int):
    conn = sqlite3.connect("todo.db")
    cursor = conn.cursor()
    cursor.execute("DELETE FROM tasks WHERE id = ?", (task_id,))
    conn.commit()
    conn.close()

    return {"message": "Task deleted successfully!"}

@app.put("/api/tasks/{task_id}/toggle")
def toggle_task(task_id: int):
    conn = sqlite3.connect("todo.db")
    cursor = conn.cursor()
    cursor.execute("SELECT completed FROM tasks WHERE id = ?", (task_id,))
    row = cursor.fetchone()

    if row is None:
        conn.close()
        return {"error": "Task not found!"}

    current_status = row[0]
    new_status = 0 if current_status == 1 else 1

    cursor.execute("UPDATE tasks SET completed = ? WHERE id = ?", (new_status, task_id))
    conn.commit()
    conn.close()

    return {"id": task_id, "completed": bool(new_status)}