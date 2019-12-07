import React from 'react'

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';


export default function Liste() {
    const [value, loading, error] = useCollection(
        firebase.firestore().collection('paroles'),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );    
    return (
        <div>
            <p>
                {error && <strong>Error: {JSON.stringify(error)}</strong>}
                {loading && <span>Collection: Loading...</span>}
                {value && (
                    <span>
                        Collection:{' '}
                        {value.docs.map(doc => (
                            <React.Fragment key={doc.id}>
                                {doc.data().titre},{' '}
                            </React.Fragment>
                        ))}
                    </span>
                )}
            </p>
        </div>
    );
}
