import React, { Component } from "react";
import Api from "./Api";
import { Searchbar } from "./Searchbar";
import { ImageGallery } from "./ImageGallery";
import Loader from "./Loader";
import { Button } from "./Button";
import Modal from "./Modal";
// import Notiflix from "notiflix";

export class App extends Component {
  state = {
    images: [],
    largeImage: null,
    page: 1,
    value: "",
    loading: false,
    showModal: false,
    error: null,
  };

  componentDidUpdate(_, prevState) {
    const { value, page } = this.state;
    const options = { value, page };

    if (prevState.value !== value) {
      this.setState(() => ({ loading: true, images: [], error: null }));

      Api(options)
        .then((images) => {
          if (images.hits.length === 0) {
            this.setState((error) => ({ error }));
          }
          this.setState({ images: images.hits });
        })
        .catch((error) => this.setState({ error }))
        .finally(() => this.setState({ loading: false }));
    }

    if (prevState.page !== page && page !== 1) {
      this.setState(() => ({ loading: true }));

      Api(options)
        .then((images) =>
          this.setState({
            images: [...prevState.images, ...images.hits],
          })
        )
        .finally(() => this.setState({ loading: false }));
    }
  }

  handleSubmit = (value) =>
    this.setState({
      value,
      page: 1,
    });

  toggleModal = () => {
    this.setState(({ showModal }) => ({ showModal: !showModal }));
  };

  onClose = (e) => {
    if (e.target === e.currentTarget || e.code === "Escape") {
      this.toggleModal();
    }
  };

  handleClickImage = (largeImage) => {
    this.toggleModal();
    this.setState({ largeImage });
  };

  handleLoadMore = () => {
    this.setState((prevState) => ({ page: prevState.page + 1 }));
  };

  render() {
    const { images, loading, showModal, largeImage } = this.state;
    return (
      <div>
        <Searchbar onSubmit={this.handleSubmit} />
        {images && (
          <ImageGallery images={images} largeImage={this.handleClickImage} />
        )}
        {loading && <Loader />}
        {images.length !== 0 &&
          (loading ? <Loader /> : <Button onClick={this.handleLoadMore} />)}
        {showModal && <Modal onClose={this.onClose}>{largeImage}</Modal>}
      </div>
    );
  }
}

