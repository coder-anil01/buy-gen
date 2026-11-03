import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const SearchInput = () => {

  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async() => {
    navigate(`/search/${keyword}`);
  }

  return (
    <>
      <form action='search' className='search-form' onSubmit={handleSubmit}>
        <input
        className='search-input'
        type='search'
        placeholder=" Search Products"
        value={keyword}
        onChange={(e)=> {setKeyword(e.target.value)}}
        />
        <Link to={`/search/${keyword}`}><button className='search-button' type='submit'><FaSearch/></button></Link>
      </form>
    </>
  )
}

export default SearchInput
