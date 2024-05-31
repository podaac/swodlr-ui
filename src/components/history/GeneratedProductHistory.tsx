import { Alert, Col, OverlayTrigger, Row, Table, Tooltip, Spinner, Form, DropdownButton, Dropdown, Badge } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { Product, ProductState } from "../../types/graphqlTypes";
import { useEffect, useState } from "react";
import { InfoCircle } from "react-bootstrap-icons";
import { generatedProductsLabels, infoIconsToRender, parameterHelp, productsPerPage } from "../../constants/rasterParameterConstants";
import { getUserProducts } from "../../user/userData";
import { useLocation, useNavigate } from "react-router-dom";
import DataPagination from "./DataPagination";
import HistoryFilters from "./HistoryFilters";
import { Adjust, FilterParameters, OutputGranuleExtentFlagOptions, OutputSamplingGridType, RasterResolution } from "../../types/historyPageTypes";
import { setShowReGenerateProductModalTrue } from "../sidebar/actions/modalSlice";
import ReGenerateProductsModal from "./ReGenerateProductsModal";
import { setAllUserProducts, setGranulesToReGenerate, setUserProducts, setWaitingForMyDataFiltering } from "../sidebar/actions/productSlice";

export const productPassesFilterCheck = (currentFilters: FilterParameters, cycle: number, pass: number, scene: number, outputGranuleExtentFlag: boolean, status: string, outputSamplingGridType: string, rasterResolution: number, dateGenerated: string, utmZoneAdjust?: number, mgrsBandAdjust?: number): boolean => {
    let productPassesFilter = true
    const outputGranuleExtentFlagMap = ['128 x 128','256 x 128']

    if(currentFilters.cycle !== 'none' && currentFilters.cycle !== String(cycle)) {
        productPassesFilter = false
    }
    if (currentFilters.pass !== 'none' && currentFilters.pass !== String(pass)) {
        productPassesFilter = false
    }
    if (currentFilters.scene !== 'none' && currentFilters.scene !== String(scene)) {
        productPassesFilter = false
    }
    if (currentFilters.outputGranuleExtentFlag.length > 0 && !currentFilters.outputGranuleExtentFlag.includes(outputGranuleExtentFlagMap[+outputGranuleExtentFlag] as OutputGranuleExtentFlagOptions)) {
        productPassesFilter = false
    }
    if (currentFilters.status.length > 0 && !currentFilters.status.includes(status as ProductState)) {
        productPassesFilter = false
    }
    if (currentFilters.outputSamplingGridType.length > 0 && !currentFilters.outputSamplingGridType.includes(outputSamplingGridType as OutputSamplingGridType)) {
        productPassesFilter = false
    }
    if (currentFilters.rasterResolution.length > 0 && !currentFilters.rasterResolution.includes(String(rasterResolution) as RasterResolution)) {
        productPassesFilter = false
    }
    if (utmZoneAdjust !== undefined && currentFilters.utmZoneAdjust.length > 0 && !currentFilters.utmZoneAdjust.includes(String(utmZoneAdjust) as Adjust)) {
        productPassesFilter = false
    }
    if (mgrsBandAdjust !== undefined && currentFilters.mgrsBandAdjust.length > 0 && !currentFilters.mgrsBandAdjust.includes(String(mgrsBandAdjust) as Adjust)) {
        productPassesFilter = false
    }
    if(currentFilters.startDate !== 'none' && new Date(dateGenerated) < currentFilters.startDate) {
        productPassesFilter = false
    }
    if(currentFilters.endDate !== 'none' && new Date(dateGenerated) > currentFilters.endDate) {
        productPassesFilter = false
    }
    return productPassesFilter
}

const GeneratedProductHistory = () => {
    const dispatch = useAppDispatch()
    const colorModeClass = useAppSelector((state) => state.navbar.colorModeClass)
    const userProducts = useAppSelector((state) => state.product.userProducts)
    const currentFilters = useAppSelector((state) => state.product.currentFilters)
    const { search } = useLocation()
    const navigate = useNavigate()
    const [totalNumberOfProducts, setTotalNumberOfProducts] = useState<number>(0)
    const [totalNumberOfFilteredProducts, setTotalNumberOfFilteredProducts] = useState<number>(0)
    const [checkedProducts, setCheckedProducts] = useState<Product[]>([])
    const [allChecked, setAllChecked] = useState<boolean>(false)
    
    useEffect(() => {
        dispatch(setWaitingForMyDataFiltering(true))
        // get the data for the first page
        // go through all the user product data to get the id of each one so that 
        const fetchData = async () => {
            await getUserProducts({limit: '1000000'}).then(response => {
                // filter products for what is in the filter
                const allProducts = response.products as Product[]
                setTotalNumberOfProducts(allProducts.length)
                const filteredProducts = allProducts.filter(product => {
                    const {status, utmZoneAdjust, mgrsBandAdjust, outputGranuleExtentFlag, outputSamplingGridType, rasterResolution, timestamp: dateGenerated, cycle, pass, scene, granules} = product
                    const statusToUse = status[0].state
                    const outputSamplingGridTypeToUse = outputSamplingGridType === 'GEO' ? 'LAT/LON' : outputSamplingGridType
                    const productPassesFilter = productPassesFilterCheck(currentFilters, cycle, pass, scene, outputGranuleExtentFlag, statusToUse, outputSamplingGridTypeToUse, rasterResolution, dateGenerated, utmZoneAdjust, mgrsBandAdjust)
                    if(productPassesFilter) {
                        return product
                    } else {
                        return null
                    }
                })
                setTotalNumberOfFilteredProducts(filteredProducts.length)
                dispatch(setAllUserProducts(filteredProducts))
                const productsPerPageToInt = parseInt(productsPerPage)
                dispatch(setUserProducts(filteredProducts.slice(0, productsPerPageToInt)))
                dispatch(setWaitingForMyDataFiltering(false))
            })
        }
        fetchData().catch(console.error)
      }, [currentFilters]);

      // reset all checked checkbox when going to next page
      useEffect(() => {
        setAllChecked(false)
      }, [userProducts]);

    const handleCopyClick = (downloadUrls: string[]) => {
        navigator.clipboard.writeText(downloadUrls.join('\n'))
    }

    const renderInfoIcon = (parameterId: string) => (
        <OverlayTrigger
            placement="right"
            overlay={
                <Tooltip id="button-tooltip">
                {parameterHelp[parameterId]}
              </Tooltip>
            }
        >
           <InfoCircle/>
        </OverlayTrigger>
    )

    const handleDownloadProduct = (downloadUrlStrings: string[]) => {
        downloadUrlStrings.forEach((downloadUrl, index) => {
            window.open(downloadUrl, String(index))
        })
    }

    const handleOnReGenerateClick = (granuleObjects: Product[]) => {
        dispatch(setGranulesToReGenerate(granuleObjects))
        dispatch(setShowReGenerateProductModalTrue())
    }
    
    const renderColTitle = (labelEntry: string[], index: number) => {
        let infoIcon = infoIconsToRender.includes(labelEntry[0]) ? renderInfoIcon(labelEntry[0]) : null
        let labelId = (labelEntry[0] === 'downloadUrl') ? 'download-url' : ''
        return (
            <th key={`${labelEntry[0]}-${index}`} id={labelId}>{labelEntry[1]} {infoIcon}</th>
        )
    }

    // select product or remove if already selected
    const handleProductChecked = (selectedProducts: Product[], checkType: 'single' | 'all') => {
        let checkedProductsClone = [...checkedProducts]
        
        selectedProducts.forEach(selectedProduct => {
            const productAlreadySelected: boolean = checkedProductsClone.map(product => product.id).includes(selectedProduct.id)
            const productShouldBeRemoved: boolean = checkType === 'all' ? allChecked : productAlreadySelected

            if(productShouldBeRemoved) {
                // remove product from checked list
                checkedProductsClone = checkedProductsClone.filter(product => product.id !== selectedProduct.id)
            } else {
                // add product to checked list
                if(!productAlreadySelected) checkedProductsClone.push(selectedProduct)
            }
        })
        if(checkType === 'all') setAllChecked(!allChecked)
        setCheckedProducts(checkedProductsClone)
    }

    const renderHistoryTable = () => {
        const downloadButtonDisabled = checkedProducts.length === 0 || checkedProducts.every(product => product.granules.length === 0)
        const downloadUrlList = checkedProducts.map(product => product.granules.map(granule => granule.uri)).flat()
        return (
            <Row>
                {<Col xs={2} style={{height: '100%'}}><HistoryFilters /></Col>}

                
                <Col xs={10}>
                    <div style={{padding: '0px 20px 20px 20px'}} id='history-table'>
                    <div>
                    {
                    totalNumberOfProducts === 0 ?
                    <Row>{productHistoryAlert()}</Row>
                    :<>
                    <Row>
                        <Col xs={1}>
                        <DropdownButton data-bs-theme='dark' style={{}} id="dropdown-basic-button" title={<><Badge bg="secondary">{checkedProducts.length}</Badge> Actions</>}>
                            <Dropdown.Item disabled={downloadButtonDisabled} onClick={() => handleDownloadProduct(downloadUrlList)}>Download</Dropdown.Item>
                            <Dropdown.Item disabled={downloadButtonDisabled} onClick={() => handleCopyClick(downloadUrlList)}>Copy Download Url</Dropdown.Item>
                            <Dropdown.Item disabled={checkedProducts.length === 0} onClick={() => handleOnReGenerateClick(checkedProducts)}>Re-Generate</Dropdown.Item>
                            <ReGenerateProductsModal />
                        </DropdownButton>
                        </Col>
                    </Row>
                    <div className="table-responsive-generatedProducts table-responsive">
                    <Table bordered hover className={`${colorModeClass}-table`} style={{marginBottom: '0px'}}>
                    <thead>
                    <tr>
                        <th key='select-action' id='select-action'>
                            <Form>
                                <div className="mb-3">
                                    <Form.Check type='checkbox' checked={allChecked} id='select-all-products-checkbox' label='' onChange={() => handleProductChecked(userProducts, 'all')}/>
                                </div>
                            </Form>
                        </th>
                        {Object.entries(generatedProductsLabels).map((labelEntry, index) => renderColTitle(labelEntry, index))}
                    </tr>
                    </thead>
                    <tbody>
                        {userProducts.map((generatedProductObject, index) => {
                            const {id, status, utmZoneAdjust, mgrsBandAdjust, outputGranuleExtentFlag, outputSamplingGridType, rasterResolution, timestamp: dateGenerated, cycle, pass, scene, granules} = generatedProductObject
                            const statusToUse = status[0].state
                            const downloadUrl = granules && granules.length !== 0 ? granules[0].uri.split('/').pop() : 'N/A'
                            const utmZoneAdjustToUse = outputSamplingGridType === 'GEO' ? 'N/A' : utmZoneAdjust
                            const mgrsBandAdjustToUse = outputSamplingGridType === 'GEO' ? 'N/A' : mgrsBandAdjust
                            const outputSamplingGridTypeToUse = outputSamplingGridType === 'GEO' ? 'LAT/LON' : outputSamplingGridType
                            const outputGranuleExtentFlagToUse = outputGranuleExtentFlag ? '256 x 128 km' : '128 x 128 km'
                            const productRowValues = {cycle, pass, scene, status: statusToUse, outputGranuleExtentFlag: outputGranuleExtentFlagToUse, outputSamplingGridType: outputSamplingGridTypeToUse, rasterResolution, utmZoneAdjust: utmZoneAdjustToUse, mgrsBandAdjust: mgrsBandAdjustToUse, downloadUrl, dateGenerated}

                            return (
                                <tr className={`${colorModeClass}-table hoverable-row`} key={`generated-products-data-row-${index}`}>
                                <td>
                                    <Form>
                                        <div className="mb-3">
                                            <Form.Check type='checkbox' checked={checkedProducts.map(product => product.id).includes(id)} id='select-all-products-checkbox' label='' onChange={() => handleProductChecked([generatedProductObject], 'single')}/>
                                        </div>
                                    </Form>
                                </td>
                                {Object.entries(productRowValues).map((entry, index2) => <td key={`${index}-${index2}`}>{entry[1]}</td>)}
                                </tr>
                            )    
                        })}
                    </tbody>
                </Table>
                </div>
                </>
                    }
                    </div>
                    {<DataPagination totalNumberOfProducts={totalNumberOfProducts} totalNumberOfFilteredProducts={totalNumberOfFilteredProducts} />}
                </div>
                </Col>
            </Row>
        )
    }
    
    const productHistoryAlert = () => {
        const alertMessage = 'No products have been generated. Go to the Product Customization page to generate products.'
        return <Col style={{margin: '30px'}}><Alert variant='warning' onClick={() => navigate(`/generatedProductHistory${search}`)} style={{cursor: 'pointer'}}>{alertMessage}</Alert></Col>
    }

    const waitingForProductsToLoadSpinner = () => {
        return (
            <div>
                <h5>Loading Data Table...</h5>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner> 
            </div>
        )
    }

    const renderProductHistoryViews = () => {
        return (
            <Col>
                <Row>{renderHistoryTable()}</Row>
            </Col>
        )
    }

    return (
        <>
        <h4 style={{marginTop: '80px', paddingBottom: '0px', marginBottom: '0px'}}>Generated Products Data</h4>
        <Col className='about-page' style={{marginRight: '20px', marginLeft: '20px'}}>
            <Row className='normal-row'>{totalNumberOfProducts === 0 ? waitingForProductsToLoadSpinner() : renderProductHistoryViews()}</Row>
        </Col>
        </>
    );
}

export default GeneratedProductHistory;