import { Col, Pagination, Row, Spinner } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setUserProducts } from "../sidebar/actions/productSlice";
import { productsPerPage } from "../../constants/rasterParameterConstants";
import { useState } from "react";


const DataPagination = (props: {totalNumberOfProducts: number, totalNumberOfFilteredProducts: number, }) => {
    const {totalNumberOfProducts, totalNumberOfFilteredProducts} = props
    const dispatch = useAppDispatch()
    const userProducts = useAppSelector((state) => state.product.userProducts)
    const allUserProducts = useAppSelector((state) => state.product.allUserProducts)
    const [noNextPage, setNoNextPage] = useState<boolean>(false)
    const [noPreviousPage, setNoPreviousPage] = useState<boolean>(true)
    const [waitingForPagination, setWaitingForPagination] = useState<boolean>(false)
    const [currentPageNumber, setCurrentPageNumber] = useState<number>(1) 
    const numberOfTotalPages = Math.ceil(allUserProducts.length / parseInt(productsPerPage))

    const handleSelectPage = async (pageNumber: number) => {
        const firstNumber = (pageNumber-1) * parseInt(productsPerPage)
        const lastNumber = firstNumber + parseInt(productsPerPage)
        dispatch(setUserProducts(allUserProducts.slice(firstNumber, lastNumber)))
        setCurrentPageNumber(pageNumber)
        if(pageNumber === 1) {
            setNoPreviousPage(true)
            setNoNextPage(false)
        } else if (pageNumber === numberOfTotalPages) {
            setNoPreviousPage(false)
            setNoNextPage(true)
        } else {
            setNoPreviousPage(false)
            setNoNextPage(false)
        }
    }

    const waitingForPaginationSpinner = () => {
        return (
            <div>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner> 
            </div>
        )
    }

    const getPaginationItemsWithEllipsis = () => {
        let numberOfSlotsFreeLeft = 0
        if(currentPageNumber >= numberOfTotalPages-4) {
            numberOfSlotsFreeLeft = 4 - (numberOfTotalPages - currentPageNumber)
        }

        let numberOfSlotsFreeRight = 0
        if(currentPageNumber <= 4) {
            numberOfSlotsFreeRight = 5 - currentPageNumber
        }
        const pagesAllowed = [currentPageNumber-2, currentPageNumber-1, currentPageNumber, currentPageNumber+1, currentPageNumber+2]
        const pagesAllowedToLeftOfCurrent: number[] = []
        for(let index=0; index<numberOfTotalPages; index++) {
            if(numberOfSlotsFreeLeft !== 0 && index+1 <= numberOfTotalPages - 3) {
                // let another number go on right
                pagesAllowedToLeftOfCurrent.push(currentPageNumber - index - 3)
                numberOfSlotsFreeLeft -= 1
            }
            if(numberOfSlotsFreeRight !== 0 && index+1 > currentPageNumber + 3) {
                // let another number go on left
                pagesAllowed.push(index)
                numberOfSlotsFreeRight -= 1
            }
        }

        pagesAllowed.unshift(...pagesAllowedToLeftOfCurrent.reverse())
        const pagesAllowedFiltered = pagesAllowed.filter(value => value > 1)
        const pagesToShow = []
        for(let pageIndex = 1; pageIndex < numberOfTotalPages-1; pageIndex++) {
            const pageNumberOfIndex = pageIndex + 1
            if(pagesAllowedFiltered.includes(pageNumberOfIndex)) {
                pagesToShow.push( <Pagination.Item key={`${pageNumberOfIndex}-pagination-item`} active={currentPageNumber === pageNumberOfIndex} onClick={() => handleSelectPage(pageNumberOfIndex)}>{pageNumberOfIndex}</Pagination.Item>)
            }
        }

        if(pagesAllowed[0] > 2) pagesToShow.unshift(<Pagination.Ellipsis />)
        if(pagesAllowed[pagesAllowed.length-1] < numberOfTotalPages-1) pagesToShow.push(<Pagination.Ellipsis />)
        return pagesToShow
    }

    return waitingForPagination ? waitingForPaginationSpinner() : (
        <Row>
            <Col xs={2}></Col>
            <Col xs={7}>
                {
                    totalNumberOfFilteredProducts !== 0 ?
                    <Pagination data-bs-theme='dark' style={{paddingTop: '15px'}} className="center">
                        <Pagination.Prev onClick={() => handleSelectPage(currentPageNumber-1)} disabled={noPreviousPage} />
                        <Pagination.Item active={currentPageNumber === 1} onClick={() => handleSelectPage(1)}>1</Pagination.Item>
                        {getPaginationItemsWithEllipsis()}
                        {numberOfTotalPages > 1 ? <Pagination.Item active={currentPageNumber === numberOfTotalPages} onClick={() => handleSelectPage(numberOfTotalPages)}>{numberOfTotalPages}</Pagination.Item> : null}
                        <Pagination.Next onClick={() => handleSelectPage(currentPageNumber+1)} disabled={userProducts.length < parseInt(productsPerPage) || noNextPage} />
                    </Pagination>
                    : null
                }
            </Col>
            <Col xs={3} style={{paddingTop: '15px'}}><h6><b>{totalNumberOfProducts}</b> Total Generated Products</h6></Col>
        </Row>
    )
}

export default DataPagination;

