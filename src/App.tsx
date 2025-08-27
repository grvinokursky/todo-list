import TaskList from './components/TaskList';

function App() {
  return (
    <div className="app">
      <header>
        <h1 className="text-center">Список задач</h1>
      </header>
      <main className="container">
        <TaskList />
      </main>
    </div>
  )
}

export default App
