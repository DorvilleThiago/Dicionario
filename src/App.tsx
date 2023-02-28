import { useEffect, useState, useRef } from "react";

function App() {

  interface DictionaryEntry {
    word: string;
    xml: string;
  }
 
  const searching = useRef<HTMLInputElement>(null);
  const word = useRef(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const [animate, setAnimate] = useState(false);
  const [query, setQuery] = useState('');
  const [prefix, setPrefix] = useState<DictionaryEntry[]>([]);
  const [final, setFinal] = useState<DictionaryEntry[] | null>(null);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  const [showLabel, setShowLabel] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setShowLabel(window.innerWidth >= 405);
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial value
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const handleKeyPress = (event: any) => {
      if (event.keyCode === 13) {
        buttonRef.current?.click();
      }
    };
    document.addEventListener('keypress', handleKeyPress);
    return () => {
      document.removeEventListener('keypress', handleKeyPress);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (searching.current && !searching.current.contains(event.target)) {
        setPrefix([])
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searching]);

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
      alert('Erro; Palavra não encontrada!')
    }
    else {
      const wordTitle = final[0].word
      const upperTitle = wordTitle.charAt(0).toUpperCase() + wordTitle.slice(1); 
      setTitle(upperTitle)
      if (!animate) {
        setAnimate(!animate)
      } else {
        setAnimate(!animate)
        setTimeout(() => {
          setAnimate(true)
        }, 10);
      }
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

      <div id='box' className="relative w-4/5 h-4/5 bg-black bg-opacity-75 rounded-3xl shadow-big flex items-center flex-col overflow-y-auto max-[768px]:w-11/12 max-[768px]:h-5/6" >

        <a target="_blank" href="https://www.thiago-dorville.tech" className="top-4 right-5 absolute w-28 h-10 bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center rounded-3xl transition-all hover:animate-wiggle">
          <i className="fa-solid fa-user text-sm mr-2"></i>
          <p className="font-bold">Portfólio</p>
        </a>

        <a target="_blank" href="https://github.com/DorvilleThiago/Dicionario" className="top-4 left-5 absolute w-28 h-10 bg-gradient-to-br from-black to-blue-400 flex items-center justify-center rounded-3xl transition-all hover:animate-wiggle">
          <i className="fa-brands fa-github text-md mr-2"></i>
          <p className="font-bold">Código</p>
        </a>

        <div className="flex items-center mt-20 ">
          <i className="fa-solid fa-book text-6xl mr-6"></i>
          <h1 className="text-7xl font-extrabold cursor-default max-[768px]:text-5xl max-[390px]:text-4xl">Dicionário</h1>
        </div>

        <div className="mt-10 z-20 flex justify-center">
          <input type="text" value={query} onChange={handleInputChange} className=" bg-white break-all rounded-3xl pl-5 pr-5 focus:outline-none text-black h-10 w-72 text-2xl max-[405px]:w-2/4" placeholder="Manda ver ;)"></input>
          <button ref={buttonRef} onClick={() => SearchWord(query)} className="h-10 w-12 ml-3 bg-green-400 rounded-3xl hover:animate-wiggle hover:bg-green-600 transition-all"><i className="fa-solid fa-magnifying-glass  text-white text-2xl"></i></button>
        </div>
        
        <div ref={searching} style={{marginRight: 60}} className="absolute mt-56 ">
          <ul className=" bg-white -translate-y-6 pt-8 pb-1 rounded-xl max-[768px]:-translate-y-8 "> 
            {showLabel && 
              prefix.map((item,index) => (  
                <li key={index} onClick={() => { SearchWord(item.word); setPrefix([]); setQuery(item.word);}} className="max-[405px]:w-10/12 text-black font-medium w-72 pl-2 cursor-pointer hover:text-white hover:bg-gradient-to-br from-blue-500 to-purple-500 rounded-md transition-all duration-300 ">{item.word}</li>
              ))
            }
          </ul>
        </div>
        { animate && 
          <div id='word' ref={word} className="mt-14 w-4/5 -z-50">
            <h1 style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }} className="text-6xl font-semibold cursor-default">{title}</h1>
            <p className="mt-5 text-lg font-thin cursor-default">{desc}</p>
          </div>
        }
      </div>

    </div>
  )
}

export default App;