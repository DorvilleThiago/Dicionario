import { useEffect, useState } from "react";
import { xml2js } from 'xml-js';
import { convertXmlToObject } from "./XmlConvert";

function App() {

  interface DictionaryEntry {
    word: string;
    xml: string;
  }

  const [query, setQuery] = useState('');
  const [prefix, setPrefix] = useState(null);
  const [final, setFinal] = useState<DictionaryEntry[] | null>(null);
  const [title, setTitle] = useState('Digite uma palavra!');

  const handleInputChange = (event: any) => {
    setQuery(event.target.value);
  };

  useEffect(() => {
    if (query.length > 2)
    fetch(`https://api.dicionario-aberto.net/prefix/${query}`)
      .then(response => response.json())
      .then(prefix => setPrefix(prefix))
  }, [query]);

  useEffect(() => {
    console.log(prefix)
  }, [prefix]);

  useEffect(() => {
    console.log(final)
    if (final != null) {
      const wordTitle = final[0].word
      const upperTitle = wordTitle.charAt(0).toUpperCase() + wordTitle.slice(1); 
      setTitle(upperTitle)
    }
  }, [final]);

  const elements = [
    { id: 1, name: 'Apple' },
    { id: 2, name: 'Banana' },
    { id: 3, name: 'Cherry' },
    { id: 4, name: 'Durian' },
    { id: 5, name: 'Elderberry' },
  ];


  
  
  const filteredElements = query
    ? elements.filter((element) =>
        element.name.toLowerCase().includes(query.toLowerCase())
      )
    : [];
  
    function SearchWord(word: string) {
      if (word.length > 0) {
        word = word.toLowerCase()
        console.log(word)
        fetch(`https://api.dicionario-aberto.net/word/${word}`)
          .then(response => response.json())
          .then(final => setFinal(final))
      }
    }
    

  return (
    <div className="h-screen bg-gradient-to-br from-blue-500 to-purple-500 flex justify-center items-center ">

      <div className="relative w-4/5 h-4/5 bg-black bg-opacity-75 rounded-3xl shadow-big flex items-center flex-col overflow-x-hidden overflow-y-auto " >

        <a target="_blank" href="https://www.thiago-dorville.tech" className="top-4 right-5 absolute w-28 h-10 bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center rounded-3xl">
          <p className="font-bold">Portfólio</p>
        </a>

        <div className="flex items-center mt-20 ">
          <i className="fa-solid fa-book text-6xl mr-6"></i>
          <h1 className="text-7xl font-extrabold">Dicionário</h1>
        </div>

        <div className="mt-10 z-20 flex">

          <input type="text" value={query} onChange={handleInputChange} className=" bg-white  rounded-3xl pl-5 focus:outline-none text-black h-10 w-72 text-2xl" placeholder="Alguém aí?"></input>
          <button onClick={() => SearchWord(query)} id='button'className="h-10 w-12 ml-3 bg-green-400 rounded-3xl"><i className="fa-solid fa-magnifying-glass  text-white text-2xl"></i></button>
        </div>
        
        <div className="">
          <ul className="absolute bg-white -translate-x-36 -translate-y-6 pt-7 pb-1 rounded-lg ">
            {filteredElements.map((element: any) => (
              <li className="text-black font-medium w-72 pl-2" key={element.id}>{element.name}</li>
            ))}
          </ul>
        </div>

        <div className="mt-5 w-4/5 ">
          <h1 className="text-6xl font-semibold">{title}</h1>
          <p className="mt-5">Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae soluta asperiores repellat et nesciunt minima, hic voluptas molestiae quibusdam molestias quo qui, quod iure blanditiis repudiandae! Recusandae ut iusto veritatis.</p>
        </div>

      </div>

    </div>
  )
}

export default App;