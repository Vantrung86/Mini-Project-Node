import React, { useEffect, useState } from 'react'
import axios from "axios"
import './style.css'
import Loading from './Loading';
export default function TodoList() {
  const [todos,setTodos] = useState([]);
  const [obj,setObj] = useState({});
  const [check,setCheck] = useState(false)
  const [flag,setFlag] = useState(false)
  const [loading,setLoading] = useState(false)

  const handleGetTodo = () => {
    try {
      setLoading(true)
      setTimeout(async()=>{
        const response = await axios.get("http://localhost:8000/api/v1/todos?per_page=4");
        setTodos(response.data)
        setLoading(false)
      },1000)
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(()=>{
    handleGetTodo()
  },[flag]);

  //lay dl input
  const handleChangeInput = (e) => {
    setObj({...obj,name:e.target.value})
  };
  //them cv
  const handleAdd = async () =>{
      try {
        const response = await axios.post("http://localhost:8000/api/v1/todos",{...obj,id:Date.now(),complete:false})
        setFlag(!flag)
        alert(response.data.messange);
        setObj({name:""})
      } catch (error) {
          if (error.response.status == 400) {
              alert(error.response.data.messange)
          }
          if (error.response.status == 402) {
              alert(error.response.data.messange)
              setObj({name:""})
          }
      }
  };
  //xoa
  const handleDelete = async (id)=>{
      if (confirm("Bạn có chắc chắn muốn xoá ?")) {
        try {
            const response = await axios.delete(`http://localhost:8000/api/v1/todos/${id}`)
            setFlag(!flag)
        } catch (error) {
            console.log(error);
        }  
      }
  };

  //edit
  const handleEdit=(item)=>{
    setObj(item);
    setCheck(true)
  };

  //update todo
  const handleUpdate=async()=>{
      try {
          const response = await axios.patch(`http://localhost:8000/api/v1/todos/${obj.id}`,obj)
          setFlag(!flag)
          setObj({name:""})
          setCheck(false)
      } catch (error) {
          if (error.response.status == 400) {
            alert(error.response.data.messange)
      }
      }
  }

  //update complete
  const handleComplete=async(id)=>{
      try {
          const response = await axios.put(`http://localhost:8000/api/v1/todos/${id}`)
          setFlag(!flag)
      } catch (error) {
          console.log(error);
      }
  }

  //Clear All
  const handleClearAll=async()=>{
    if (confirm("Bạn có muốn xoá tất cả ?")) {
        try {
            const response = await axios.delete("http://localhost:8000/api/v1/clear")
            setTodos(response.data);
        } catch (error) {
            console.log(error);
        }     
    }
  };
  
  //Đếm số bản ghi có complete:false
  const dataFalse = todos.filter(item=>item.complete == false)

  return (
    <div className='container'>
        <h1>Todo App</h1>
        <div className='form-group'>
          <input type="text" name="name" value={obj.name} onChange={handleChangeInput} placeholder='Add your new todo'/>
          <button onClick={check?handleUpdate:handleAdd}>+</button>
        </div>
        {loading && <div style={{display: 'flex', justifyContent: 'center', margin: '20px 0'}}>
            <Loading />
            </div> }
        <ul>
          {todos.map((item)=>(
                <li key={item.id}>
                      <p onClick={()=>handleComplete(item.id)} 
                        style={{textDecoration:item.complete ? "line-through" : ""}}
                      >
                          {item.name}
                      </p>
                      <i onClick={()=>handleEdit(item)} class="fa-solid fa-pen-to-square"></i>                   
                      <i onClick={()=>handleDelete(item.id)} class="fa-solid fa-trash"></i>
                </li>
          ))}
        </ul>
        <div className='botton'>
            <span>You have {dataFalse.length} pendding tasks</span>
            <button onClick={handleClearAll}>Clear All</button>
        </div>
    </div>
  )
}
