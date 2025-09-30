'use client';

import React, { FC, useState } from 'react';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { motion } from 'framer-motion';
import FileUploader from '@/components/files/FileUploader';
import { LineData } from '@/types/textRazorTypes';
import { useAnalyzeText } from '@/hooks/useAnalyzeText';
import Charts from '@/components/charts/ChartsWrapper';
import EntityHighlighter from '../textEntity/EntityHighlighter';


const HomepageWrapper: FC = () => {
    const [linesData, setLinesData] = useState<LineData[]>([]);
    const { mutateAsync, isPending, isError, error } = useAnalyzeText();


    const handleFileRead = async (lines: string[]) => {
        const all: LineData[] = [];


        for (const line of lines) {
            try {
                const res = await mutateAsync(line);
                all.push({ text: line, entities: res.response.entities ?? [] });
            } catch (err) {
                console.error('line process error', err);
            }
        }


        setLinesData(all);
    };


    const counts: Record<string, number> = {};
    linesData.forEach((ld) => ld.entities.forEach((e) => {
        const t = e.type?.[0] ?? 'Unknown';
        counts[t] = (counts[t] || 0) + 1;
    }));
    const entityCounts = Object.entries(counts).map(([type, count]) => ({ type, count }));


    return (
        <Container className="py-4">
            <motion.h1 initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>TextRazor Dashboard</motion.h1>


            <Row className="mt-3">
                <Col xs={12} md={6}>
                    <FileUploader onFileRead={handleFileRead} />
                </Col>
                <Col xs={12} md={6}>
                    {isPending && <Spinner animation="border" />}
                    {isError && <Alert variant="danger">{(error as Error)?.message ?? 'Error'}</Alert>}
                </Col>
            </Row>


            {entityCounts.length > 0 && (
                <Row className="mt-4">
                    <Col xs={12} md={6}>
                        <Charts entityCounts={entityCounts} />
                    </Col>
                    <Col xs={12} md={6}>
                        <h5>Texts with highlighted entities</h5>
                        <div style={{ maxHeight: 560, overflow: 'auto' }}>
                            {linesData.map((l, idx) => (
                                <EntityHighlighter key={idx} text={l.text} entities={l.entities} />
                            ))}
                        </div>
                    </Col>
                </Row>
            )}
        </Container>
    );
}

export default HomepageWrapper