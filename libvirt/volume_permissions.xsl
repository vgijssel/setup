<?xml version="1.0" ?>
<xsl:stylesheet version="1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output omit-xml-declaration="yes" indent="yes"/>

  <xsl:template match="node()|@*">
    <xsl:copy>
      <xsl:apply-templates select="node()|@*"/>
    </xsl:copy>
  </xsl:template>

  <xsl:template match="target">
    <xsl:copy>
      <xsl:apply-templates select="@*|node()"/>
      <permissions>
        <mode>0777</mode>
        <owner>64055</owner>
        <group>64055</group>
        <label>virt_image_t</label>
      </permissions>
    </xsl:copy>
  </xsl:template>

</xsl:stylesheet>
