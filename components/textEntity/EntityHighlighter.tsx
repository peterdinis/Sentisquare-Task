'use client';
import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { TextRazorEntity } from '@/types/textRazorTypes';
import { highlightEntities } from '@/utils/highlight';

interface Props {
  text: string;
  entities: TextRazorEntity[];
}

export default function EntityHighlighter({ text, entities }: Props) {
  const items = entities.map(e => ({ matchedText: e.matchedText, type: e.type?.[0] }));
  const html = highlightEntities(text, items);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-2">
      <Card className="p-3">
        <div dangerouslySetInnerHTML={{ __html: html }} />
        <div className="mt-2">
          {entities.map((e, i) => (
            <Badge key={i} pill bg="info" text="dark" className="me-1">
              {e.matchedText} ({e.type?.[0] ?? 'Unknown'})
            </Badge>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}
