import { React, useState, useEffect, useMemo } from "react";
import Paginate from "./paginate";
import SearchBar from "./searchBar";
import "./style.css";

export default function Fetch() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [currPage, setCurrPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  useEffect(() => {
    const getData = () => {
      fetch(
        "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
      )
        .then((res) => res.json())
        .then((data) => {
          setData(data.map((d)=>{
            return{
            select:false,
            id:d.id,
            name:d.name,
            email:d.email,
            role:d.role
          }
          }));
        });
    };
    getData();
  }, []);


//delete an user from table
  const remove = (id) => {
    var actualData = data.filter((data) => data.id !== id);
    setData(actualData);
  };

  //search and show data according to page
  const newData = useMemo(() => {
    let newName = data;
    if(search){
      newName = newName.filter(user => user.name.toLowerCase().includes(search.toLowerCase()))
    }
    setTotalPages(newName.length);
    return newName.slice(
      (currPage - 1) * ITEMS_PER_PAGE,
      (currPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
    );
  }, [data, currPage, search]);
  //inline edit of row data
  const [editDataId, setEditDataId] = useState('');
  const [editFormData, setEditFormData] = useState({
    name:"",
    email:"",
    role:""
  })
  const handleEditClick = (event, data) => {
     event.preventDefault();
     setEditDataId(data.id);
     const formValues = {
       name:data.name,
       email:data.email,
       role:data.role
     }
     setEditFormData(formValues)
     
  }

  const handleEditFormData = (event) => {
     event.preventDefault();
     const fieldName = event.target.getAttribute("name");
     const fieldValue = event.target.value;
     const newFormData = {...editFormData}
     newFormData[fieldName] = fieldValue;
     setEditFormData(newFormData);

  }

  //to save the edited value
  const handleEditFormDataSubmit = (event) => {
    event.preventDefault();
     const editedData = {
       id: editDataId,
       name:editFormData.name,
       email:editFormData.email,
       role:editFormData.role

     }
     const newDatas = [...data]
     const index = data.findIndex((item)=> item.id === editDataId)
       
        newDatas[index] = editedData
        setData(newDatas);
        setEditDataId('');
  }
 

  //to cancel the changes made
  const handleCancelClick = () => {
    setEditDataId('');
  }

  //selectall delete data from row
  const selectAll = (e) => {
    let checked = e.target.checked;
    let newSelected = [...data];
    setData(
      newSelected.map((d, index)=>{
        if(index < currPage*ITEMS_PER_PAGE){
          d.select = checked;
          return d;
      }else{
        return d;
      }
      })
    )
  }

  //delete selected values
  const removeSelectedId = ()=>{
    const deletedData = [...data];
    var removeValue = [];
    const myData = deletedData.map((item)=>{
         if(item.select){
          return removeValue.push(item);
         }
    })
    var updatedData = deletedData.filter(value => !removeValue.includes(value));
    setData(updatedData);  
  }
  

  return (
    <div>
      <div>
        <h2>Admin UI</h2>
      </div>
      <SearchBar
          onSearch={(value) => {
          setSearch(value);
          setCurrPage(1);
        }}
      />
      <form onSubmit={ handleEditFormDataSubmit}>
      <table id="customers">  
        <tr>
          <th><input type="checkbox" onChange={selectAll}/></th>  
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Action</th> 
        </tr>

        {newData &&
          newData.map((item) => ( 
            <>
            {editDataId === item.id ? (
               <tr>
                 <td>
                   <input type="checkbox"/>
                 </td>
               <td>
                 <input
                   type="text"
                   value={editFormData.name}
                   name="name"
                   placeholder="enter your name"
                   required="required"
                   onChange={handleEditFormData} />
                   
               </td>
               <td>
                 <input
                   type="email"
                   value={editFormData.email}
                   name="email"
                   placeholder="enter your email"
                   required="required"
                   onChange={handleEditFormData} />
               </td>
               <td>
                 <input
                   type="text"
                   value={editFormData.role}
                   name="role"
                   placeholder="enter your role"
                   required="required"
                   onChange={handleEditFormData} />
               </td>
               <td>
               <td>
                 <button type="submit">Save</button>
               </td>
               <td>
                 <button type="button" onClick={handleCancelClick}>Cancel</button>
               </td>
             </td>
             </tr>
            ):

            (<tr>
              <td><input type="checkbox" onChange={
                (e) => {
                  let checked = e.target.checked;
                  setData(
                    data.map(data=>{
                      if(item.id === data.id){
                        data.select = checked;
                      }
                      return data;
                    })
                  )
              
                }

              } checked={item.select}/></td>
              <td>{item.name}</td>
              <td>{item.email}</td>
              <td>{item.role}</td>
              <td>
                <td>
                  <button onClick={(event)=>handleEditClick(event, item)}>Edit</button>
                </td>
                <td>
                  <button onClick={() => remove(item.id)}>Delete</button>
                </td>
              </td>
             
            </tr>
        )}
         </>
              
          ))}    
          
      </table>
      </form>
      <div className="at-center">
        {newData.length > 0 ? <Paginate
          total={totalPages}
          itemsPerPage={ITEMS_PER_PAGE}
          currentPage={currPage}
          onPageChange={(page) => setCurrPage(page)}
        />: <tr><td>No Record Found</td></tr>
        }
      </div>
      <div>

           {newData.length > 1 ? <button onClick={removeSelectedId}>Delete All</button> : ''}

        
      </div>
    </div>
  );
}
