import { registerPlugin } from '@wordpress/plugins';
import JetpackLocalAiPlugin from './excerpt/plugin.jsx';

registerPlugin( 'jetpack-local-ai', { render: JetpackLocalAiPlugin } );
