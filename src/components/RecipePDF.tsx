import { staticURL } from "@/lib/api";
import { RecipeDetails } from "@/types";
import {
  Document,
  Page,
  Text,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";

type RecipePDFProps = {
  recipe: RecipeDetails;
};

export const RecipePDF = ({
  recipe: { name, user, imagePath, ingredients, instructions },
}: RecipePDFProps) => (
  <Document>
    <Page style={styles.body}>
      <Text style={styles.title}>{name}</Text>
      <Text style={styles.author}>
        {user.firstName} {user.lastName}
      </Text>
      <Image style={styles.image} src={`${staticURL}/${imagePath}`} />
      <Text style={styles.subtitle}>Składniki</Text>
      <Text style={styles.text}>{ingredients}</Text>
      <Text style={styles.subtitle}>Przygotowanie krok po kroku</Text>
      <Text style={styles.text}>{instructions}</Text>
      <Text
        style={styles.pageNumber}
        render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
        fixed
      />
    </Page>
  </Document>
);

Font.register({
  family: "Roboto",
  src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf",
});

const styles = StyleSheet.create({
  body: {
    fontFamily: "Roboto",
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
  },
  author: {
    fontSize: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    margin: 12,
  },
  text: {
    margin: 12,
    fontSize: 14,
    textAlign: "justify",
  },
  image: {
    marginHorizontal: 100,
  },
  header: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: "center",
    color: "grey",
  },
  pageNumber: {
    position: "absolute",
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "grey",
  },
});
