import os
import tempfile
import unittest
from unittest.mock import patch

import generate_config


class GenerateConfigTests(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp_dir.cleanup)
        self.base_path = self.temp_dir.name
        self.base_patch = patch.object(generate_config, 'base_path', self.base_path)
        self.base_patch.start()
        self.addCleanup(self.base_patch.stop)

    def add_pdf(self, folder, name='test.pdf'):
        path = os.path.join(self.base_path, *folder.split('/'))
        os.makedirs(path, exist_ok=True)
        with open(os.path.join(path, name), 'wb') as file:
            file.write(b'%PDF')
        return path

    def test_applied_award_tier_topic_and_year_matching(self):
        topic = self.add_pdf('Applied/Double Award/Unit 1/FT/By Topic/Cells')
        topic_ms = self.add_pdf('Applied/Double Award/Mark Schemes/Unit 1/FT/By Topic/Cells')
        separated = self.add_pdf('Applied/Single Award/Unit 1/HT/Separated Papers/Unit 1 HT 2024_questions')
        separated_ms = self.add_pdf('Applied/Single Award/Mark Schemes/Unit 1/HT/Separated Papers/Unit 1 HT MS 2024')
        self.add_pdf('Applied/Double Award/Mark Schemes/Unit 1/HT/By Topic/Cells')

        self.assertEqual(generate_config.find_mark_scheme_folder(topic)['path'],
                         generate_config.format_path(topic_ms))
        self.assertEqual(generate_config.find_mark_scheme_folder(separated)['path'],
                         generate_config.format_path(separated_ms))

    def test_missing_and_empty_matching_mark_schemes_are_not_linked(self):
        paper = self.add_pdf('Applied/Double Award/Unit 1/FT/Separated Papers/Unit 1 FT 2024')
        self.add_pdf('Applied/Double Award/Mark Schemes/Unit 1/FT/Separated Questions/Unit 1 FT MS 2023')
        os.makedirs(os.path.join(self.base_path, 'Applied/Double Award/Mark Schemes/Unit 1/FT/Separated Questions/Unit 1 FT MS 2024'))
        self.assertIsNone(generate_config.find_mark_scheme_folder(paper))

    def test_mixed_folder_preserves_direct_pdfs_and_subfolders(self):
        tier_path = self.add_pdf('Applied/Double Award/Unit 1/FT', 'overview.pdf')
        self.add_pdf('Applied/Double Award/Unit 1/FT/Whole Papers', 'paper.pdf')
        self.add_pdf('Applied/Double Award/Unit 1/FT/Separated Papers/2024', 'question.pdf')
        tier = generate_config.build_structure(tier_path)
        self.assertEqual(tier['Files in this folder']['files'][0]['name'], 'overview.pdf')
        self.assertIn('Whole Papers', tier)
        self.assertIn('Separated Papers', tier)

    def test_missing_root_fails_instead_of_generating_empty_config(self):
        with self.assertRaises(FileNotFoundError):
            generate_config.build_structure(os.path.join(self.base_path, 'missing'))


if __name__ == '__main__':
    unittest.main()
