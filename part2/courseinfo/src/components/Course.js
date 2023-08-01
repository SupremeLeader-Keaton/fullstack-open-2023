const Header = (props) => (
      <h2>{props.course}</h2>
    )
  
const Part = ({part}) => (
      <p>{part.name} {part.exercises}</p>
    )
  
const Content = ({parts}) => (
      <>
        {parts.map(parts => <Part key={parts.id} part={parts} />)}
      </>
    )
  
const Total = ({parts}) => (
      <p><b>total of {parts.reduce((sum, part) => sum + part.exercises, 0)} exercises</b></p>
    )
  
const Course = ({course}) => (
      <>
        <h1>Web development curriculum</h1>
        {course.map(course=>
        <div key={course.id}>
          <Header course={course.name} />
          <Content parts={course.parts} />
          <Total parts={course.parts} />
        </div>
          )}
      </>
    )

export default Course