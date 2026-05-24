import { EnterpriseDepthFeaturePage, makeEnterpriseDepthServerSideProps } from '../../features/enterprise-depth/enterprise-depth-feature-page';

export const getServerSideProps = makeEnterpriseDepthServerSideProps('supplierDispute');
export default EnterpriseDepthFeaturePage;
