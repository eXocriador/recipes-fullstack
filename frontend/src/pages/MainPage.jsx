import { useState } from "react";
import SearchBox from "../components/SearchBox/SearchBox";
import ModalErrorWhileSaving from "../components/ModalErrorWhileSaving/ModalErrorWhileSaving";
import ListWrapper from "../components/ListWrapper/ListWrapper";
import Container from "../components/container/container";
const MainPage = () => {
  const [filter, setFilter] = useState({
    category: "",
    ingredient: "",
    title: "",
    page: 1,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearched, setIsSearched] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const onClose = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <SearchBox
        filter={filter}
        setFilter={setFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setIsSearched={setIsSearched}
      />
      {isModalOpen && (
        <ModalErrorWhileSaving onClose={onClose} isModalOpen={isModalOpen} />
      )}
      <Container>
        <ListWrapper
          isModalOpen={setIsModalOpen}
          filter={filter}
          setFilter={setFilter}
          isSearched={isSearched}
          setSearchQuery={setSearchQuery}
        />
      </Container>
    </>
  );
};

export default MainPage;
