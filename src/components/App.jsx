import { Component } from 'react';
import {API} from './API';
import {Searchbar} from './Searchbar';
import {ImageGallery} from './ImageGallery';
import {ImageGalleryItem} from './ImageGalleryItem';
import {Loader} from './Loader';
import {Button} from './Button';
import {Modal} from './Modal';
import {FetchStartGallery, 
  FetchSearch} from './API';
import Notiflix from 'notiflix';


const perPage = 12;

export class App extends Component {
  state = {
    images: [],
    largeImageURL: '',
    loading: false,
    page: 1,
    value: '',
    canShowMore: false,
    showModal: false,
  }

  componentDidMount() {
    FetchStartGallery(this.state.page)
    .then(data => {
      this.setState({
        images: [ ...data.hits],
      })
      if(data.total > perPage){
        this.setState({ canShowMore: true })
      }
    })
    .catch();

  }

  componentDidUpdate(_, prevState) {

    const {images, value, page} = this.state;
    
    if(prevState.value !== value) {
      this.setState({images: [], 
        page: 1,
        loading: true,
      })
    }

    if(prevState.value !== value || prevState.page !== page){
      
      FetchSearch(value, page)
      .then(data => {
        this.setState(prevState => ({
          images: [...prevState.images, ...data.hits],
          loading: false,
        }));

        if(data.total > perPage){
          this.setState({ canShowMore: true })
        } else if(data.total - images.length <= perPage){
          this.setState({ canShowMore: false })
        }
        
      })
      .catch(this.onApiError);

    }
  }

  onApiError = () => {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    this.setState({ loading: false, canShowMore: false });
  };

  handleFormSubmit = value => {
    if(!this.state.showModal){
    this.setState({ value })
    }
    return  
  }

  showMore = () => {
    this.setState(prevState => ({ page: prevState.page +1 }))
  }

  canShowMore = () => {
    const {images} = this.state
    if(images.total > perPage){
      this.setState({ canShowMore: true })
    } else if(images.total <= images.length + perPage){
      this.setState({ canShowMore: false })
      Notiflix.Notify.info(`We're sorry, but you've reached the end of search results.`)
    }
  }

  toggleModal = () => {
    this.setState(({showModal}) => ({
      showModal: !showModal,
    }))
  }

  onImageClick = (largeImageURL) => {
    this.setState({ largeImageURL });
    this.toggleModal();
  };


  render() {
    const { images, value, loading, canShowMore, showModal, largeImageURL } = this.state;

    return(
      <>
        <Searchbar onSubmit={this.handleFormSubmit}/>

        <ImageGallery 
          images={images}
          value={value}
          onClick={this.onImageClick}
        />

        {loading && <Loader />}

        {canShowMore && <Button onShowMore={this.showMore}/>}

        {showModal && <Modal 
          onClose={this.toggleModal}
          largeImageURL={largeImageURL}
        />}
      </>
    )
  }
}