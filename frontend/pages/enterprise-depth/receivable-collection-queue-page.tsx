import { EnterpriseDepthFeaturePage, makeEnterpriseDepthServerSideProps } from '../../features/enterprise-depth/enterprise-depth-feature-page';

export const getServerSideProps = makeEnterpriseDepthServerSideProps('collectionQueue');
export default EnterpriseDepthFeaturePage;
