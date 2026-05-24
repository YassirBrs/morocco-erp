import { EnterpriseDepthFeaturePage, makeEnterpriseDepthServerSideProps } from '../../features/enterprise-depth/enterprise-depth-feature-page';

export const getServerSideProps = makeEnterpriseDepthServerSideProps('supplierPortalUpload');
export default EnterpriseDepthFeaturePage;
