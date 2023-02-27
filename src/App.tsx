import { useEffect, useState } from "react";
import {parseString} from "xml"

function App() {

  interface DictionaryEntry {
    word: string;
    xml: string;
  }
  const [query, setQuery] = useState('');
  const [prefix, setPrefix] = useState([]);
  const [final, setFinal] = useState<DictionaryEntry[] | null>(null);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');


  const handleInputChange = (event: any) => {
    setQuery(event.target.value);
  };

  useEffect(() => {
    if (query.length > 2) {
      fetch(`https://api.dicionario-aberto.net/prefix/${query}`)
        .then(response => response.json())
        .then(prefix => setPrefix(prefix.slice(0, 5)));
    } else {
      setPrefix([]);
    }
  }, [query]);

  useEffect(() => {
    if (final === null) {
    }
    else if (final?.length === 0) {
      alert('palavra não encontrada!')
    }
    else {
      const wordTitle = final[0].word
      const upperTitle = wordTitle.charAt(0).toUpperCase() + wordTitle.slice(1); 
      setTitle(upperTitle)

      let parser = new DOMParser();
      let xmldoc = parser.parseFromString(final[0].xml, 'text/xml');
      let def = xmldoc.getElementsByTagName('def')[0].textContent?.toString();
      setDesc(def ?? '');

      
    }
  }, [final]);
  
    function SearchWord(word: string) {
      if (word.length > 0) {
        word = word.toLowerCase()
        fetch(`https://api.dicionario-aberto.net/word/${word}`)
          .then(response => response.json())
          .then(final => setFinal(final))
          .catch(error => console.error('Error fetching data:', error))
      }
    }

  return (
    <div className="h-screen bg-gradient-to-br from-blue-500 to-purple-500 flex justify-center items-center ">

      <div id='box' className="relative w-4/5 h-4/5 bg-black bg-opacity-75 rounded-3xl shadow-big flex items-center flex-col overflow-x-hidden overflow-y-auto" >

        <a target="_blank" href="https://www.thiago-dorville.tech" className="top-4 right-5 absolute w-28 h-10 bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center rounded-3xl hover:scale-105 transition-all">
          <p className="font-bold">Portfólio</p>
        </a>

        <div className="flex items-center mt-20 ">
          <i className="fa-solid fa-book text-6xl mr-6"></i>
          <h1 className="text-7xl font-extrabold cursor-default">Dicionário</h1>
        </div>

        <div className="mt-10 z-20 flex">

          <input type="text" value={query} onChange={handleInputChange} className=" bg-white  rounded-3xl pl-5 focus:outline-none text-black h-10 w-72 text-2xl" placeholder="Alguém aí?"></input>
          <button onClick={() => SearchWord(query)} id='button'className="h-10 w-12 ml-3 bg-green-400 rounded-3xl"><i className="fa-solid fa-magnifying-glass  text-white text-2xl"></i></button>
        </div>
        
        <div style={{marginRight: 60}} className="absolute mt-56">
          <ul className=" bg-white -translate-y-6 pt-8 pb-1 rounded-xl "> 
            {
              prefix.map((item,index) => (  
                <li key={index} onClick={() => { SearchWord(item.word); setPrefix([]) }} className="text-black font-medium w-72 pl-2 cursor-pointer hover:bg-gray-500">{item.word}</li>
              ))
            }
          </ul>
        </div>

        <div id='box' className="mt-14 w-4/5 animate-wiggle">
          <h1 className="text-6xl font-semibold cursor-default">{title}</h1>
          <p className="mt-5 text-lg font-thin cursor-default">{desc}</p>
        </div>

      </div>

    </div>
  )
}

export default App;